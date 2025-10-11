import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'api', 'data', 'books.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  if (req.method === 'GET') {
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { title, link } = req.body;
    data.books.push({ title, link });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.status(201).json({ message: 'Book added' });
  } else if (req.method === 'DELETE') {
    const index = parseInt(req.query.index);
    if (!isNaN(index)) {
      data.books.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      res.status(200).json({ message: 'Book deleted' });
    } else {
      res.status(400).json({ message: 'Invalid index' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
  }

