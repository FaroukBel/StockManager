const Joi = require('joi');

module.exports = {
  async register(req, res, next) {
    const schema = Joi.object({
      Username: Joi.number(),
      Password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{8,32}$')
      ),
    });

    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      switch (error.details[0].context.key) {
        case 'username':
          res.status(400).send({
            error: 'You must provide a valid username',
          });
          break;
        case 'password':
          res.status(400).send({
            error: `The password provided failed to match the following rules:
              <br>
              1. It must contain ONLY the following characters: lower case, upper case, numerics.
              <br>
              2. It must be at least 8 characters in length and not greater than 32 characters in length.
            `,
          });
          break;
        default:
          res.status(400).send({
            error: 'Invalid registration information',
          });
      }
    }
  },
};