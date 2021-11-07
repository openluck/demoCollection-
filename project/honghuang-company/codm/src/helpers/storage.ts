class Storage {
  // private stringsKey: string[] = [];
  public set(data: Partial<LocalStorageData>) {
    let key: LocalStorageKey;
    for (key in data) {
      const d = data[key];
      localStorage.setItem(key, JSON.stringify(d));
    }
  }

  public get<K extends LocalStorageKey>(keys: K[]) {
    const res: Pick<LocalStorageData, K> = {} as any;
    for (const key of keys) {
      const v = localStorage.getItem(key as string);
      try {
        res[key] = JSON.parse(v || '') as any;
      } catch (error) {
        console.error(error, v);
        res[key] = '' as any;
      }
    }
    return res as Pick<LocalStorageData, Extract<keyof LocalStorageData, K>>;
  }

  public getBySession<K extends SessionStorageKey>(keys: K[]) {
    const res = {} as any;
    for (const key of keys) {
      const value = sessionStorage.getItem(key as string) || '';
      if (this.needJsonParse(value)) {
        res[key] = JSON.parse(value);
      } else {
        res[key] = value;
      }
    }
    return res as Pick<SessionStorageData, Extract<keyof SessionStorageData, K>>;
  }

  public needJsonParse(value: string) {
    if (value.startsWith('{"') || value.startsWith('[')) {
      return true;
    }
    return false;
  }

  public setBySession(data: Partial<SessionStorageData>) {
    let key: SessionStorageKey;
    for (key in data) {
      const d = data[key];
      if (typeof d === 'string') {
        sessionStorage.setItem(key, d);
      } else {
        sessionStorage.setItem(key, JSON.stringify(d));
      }
    }
  }
}

export const storage = new Storage();
