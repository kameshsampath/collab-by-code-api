import { Request, Response } from 'express';

import { app } from '../app';
import { Questions } from '../model/models';

//Save New Question
app.post('/api/questions', (req: Request, res: Response) => {
  const data = new Questions(req.body);
  data.save().then((doc) => {
    res
      .contentType('json')
      .status(201)
      .send(doc);
  }, (err) => {
    res
      .status(400)
      .send(err);
  });
});

//Get all questions
app.get('/api/questions', (req: Request, res: Response) => {
  Questions.find().then((docs) => {
    res
      .contentType('json')
      .status(200)
      .send(docs);
  }, (err) => {
    res
      .status(400)
      .send(err);
  });
});