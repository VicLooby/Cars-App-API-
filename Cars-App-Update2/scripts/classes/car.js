// type class

import isURI from "https://esm.sh/is-uri";

export default class Car {
  constructor({ name = "", bhp = 0, avatar_url = "", _id } = {}) {
    if (typeof _id !== "string")
      throw new Error(
        `A car requires an '_id' (of type 'string'); instead received ${_id} (of type ${typeof _id})`
      );

    if (!_id.length) throw new Error(`'_id' cannot be an empty string`);

    // check
    if (typeof name !== "string")
      throw new Error(
        `A car requires an 'name' (of type 'string'); instead received ${name} (of type ${typeof name})`
      );

    if (!name.length) throw new Error(`'name' cannot be an empty string`);

    if (typeof bhp !== "number" && !Number.isNaN(bhp))
      throw new Error(
        `A car requires an 'bhp' (of type 'number'); instead received ${bhp} (of type ${typeof bhp})`
      );

    if (bhp < 0 || bhp > 6000)
      throw new Error(
        `A car requires an 'bhp' (of type 'number'); instead received ${bhp} (of type ${typeof bhp})`
      );

    if (typeof avatar_url !== "string")
      throw new Error(
        `A car requires an 'avatar_url' (of type 'string'); instead received ${avatar_url} (of type ${typeof avatar_url})`
      );

    if (!isURI(avatar_url))
      throw new Error(
        `A car requires an 'avatar_url' which must be a complete URL`
      );

    this._id = _id;

    this.name = name;
    this.bhp = bhp;
    this.avatar_url = avatar_url;

    // Freeze to protect
    Object.freeze(this);
  }
}
