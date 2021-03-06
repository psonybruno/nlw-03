import { Request, Response} from 'express'
import { getRepository } from 'typeorm'
import Orphanages from '../models/Orphanages';
import orphanageView from '../views/orphanages_view';
import * as Yup from 'yup'

export default {

    async index(request: Request, response: Response)
    {
      try {
        const OrphanagesRepository = getRepository(Orphanages);
        const orphanages = await OrphanagesRepository.find({
          relations: ['images']
        });
        return response.json(orphanageView.renderMany(orphanages));
      } catch (error) {
        console.log(error)
      }

      return response.sendStatus(400);

    },

    async show(request: Request, response: Response)
    {
      const { id } = request.params;
      const OrphanagesRepository = getRepository(Orphanages);
      const orphanages = await OrphanagesRepository.findOneOrFail(id, {
        relations: ['images']
      });

      return response.json(orphanageView.render(orphanages));
    },

    async create(request: Request, response: Response)
    {
      const {
          name,
          latitude,
          longitude,
          about,
          instructions,
          opening_hours,
          open_on_weekends,
      } = request.body;

      const OrphanagesRepository = getRepository(Orphanages);

      const requestImages = request.files as Express.Multer.File[];

      const images = requestImages.map(image => {
        return {path: image.filename}
      });

      const data = {
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends: open_on_weekends === 'true' ? true : false,
        images
      }

      const schema = Yup.object().shape({
        name: Yup.string().required(),
        latitude: Yup.number().required(),
        longitude: Yup.number().required(),
        about: Yup.string().required().max(300),
        instructions: Yup.string().required(),
        opening_hours: Yup.string().required(),
        open_on_weekends: Yup.string().required(),
        images: Yup.array(
          Yup.object().shape({
            path: Yup.string().required()
          })
        )
      });

      await schema.validate(data, {
        abortEarly: false,
      })

      const orphanage = OrphanagesRepository.create(data);

      await OrphanagesRepository.save(orphanage);
      return response.json(orphanage);

    }
}