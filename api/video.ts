import { NowRequest, NowResponse } from "@now/node";
import { getInfo } from "ytdl-core";

export default (req: NowRequest, res: NowResponse) => {
  const {
    query: { id },
  } = req;

  if (!id) {
    res.status(403);
    res.json({ error: "No id provided" });
    return;
  }

  getInfo(`${id}`)
    .catch(() => {
      res.status(404);
      res.json({ error: "Video not found" });
    })
    .then((data: any) => {
      res.status(200);
      res.json(data);
    });
};
