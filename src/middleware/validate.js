import { ZodError } from 'zod';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const data = source === 'query' ? req.query : source === 'params' ? req.params : req.body;
      const parsed = schema.parse(data);
      if (source === 'query') req.query = parsed;
      else if (source === 'params') req.params = parsed;
      else req.body = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: err.flatten() });
      }
      return next(err);
    }
  };
}


