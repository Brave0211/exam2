import fs from "fs";
import path from "path";

const read = (dir) => {
  return new Promise((res, rej) => {
    fs.readFile(path.join(process.cwd(), "src", "model", dir), (err, data) => {
      if (!fs.existsSync(path.join(process.cwd(), "src", "model", dir))) {
        return rej("Path not found" + dir);
      }

      if (err) return rej(err);
      res(JSON.parse(data));
    });
  });
};

const write = (dir, data) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path.join(process.cwd(), "src", "model", dir))) {
      return reject("Path not found" + dir);
    }
    fs.writeFile(
      path.join(process.cwd(), "src", "model", dir),
      JSON.stringify(data, null, 4),
      (err) => {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
};

export { read, write };