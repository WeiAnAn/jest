/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getType = require('jest-get-type');

const supportTypes = ['map', 'array', 'object'];

type ReplaceableForEachCallBack = (value: any, key: any, object: any) => void;

export default class Replaceable {
  object: any;
  type: string;

  constructor(object: any) {
    this.object = object;
    this.type = getType(object);
    if (!supportTypes.includes(this.type))
      throw new Error(`Type ${this.type} is not support in Replaceable!`);
  }

  static isReplaceable(obj1: any, obj2: any): Boolean {
    const obj1Type = getType(obj1);
    const obj2Type = getType(obj2);
    return obj1Type === obj2Type && supportTypes.includes(obj1Type);
  }

  forEach(cb: ReplaceableForEachCallBack): void {
    if (this.type === 'object')
      Object.entries(this.object).forEach(([key, value]) => {
        cb(value, key, this.object);
      });
    else this.object.forEach(cb);
  }

  get(key: any): any {
    if (['object', 'array'].includes(this.type)) return this.object[key];
    else if (this.type === 'map') return this.object.get(key);
  }

  set(key: any, value: any): any {
    if (['object', 'array'].includes(this.type))
      return (this.object[key] = value);
    else if (this.type === 'map') return this.object.set(key, value);
  }
}
