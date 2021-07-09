const ROOT_URL = "https://getpocket.com";
const ADD_URL = "/v3/add";
const SEND_URL = "/v3/send";
const GET_URL = "/v3/get";
const OAUTH_REQUEST_URL = "/v3/oauth/request";
const OAUTH_TOKEN_URL = "/auth/authorize";
const OAUTH_ACCESS_URL = "/v3/oauth/authorize";

const headers = {
  "Content-Type": "application/json; charset=UTF-8",
  "X-Accept": "application/json",
};

export interface GetOptions {
  state?: "unread" | "archive" | "all";
  favorite?: 0 | 1;
  tag?: "_untagged_" | string;
  contentType?: "article" | "video" | "image";
  sort?: "newest" | "oldest" | "title" | "site";
  detailType?: "simple" | "complete";
  search?: string;
  domain?: string;
  since?: string;
  count?: number;
  offset?: number;
}

export interface GetResponse {
  status: number;
  complete: number;
  error: string;
  search_meta: SearchMeta;
  since: number;
  list: Array<NewsItem>;
}

interface SearchMeta {
  search_type: "normal" | string;
}

export interface NewsItem {
  item_id: string;
  resolved_id: string;
  given_url: string;
  given_title: string;
  favorite: "0" | "1";
  status: "0" | "1" | "2";
  time_added: string;
  time_updated: string;
  time_read: string;
  time_favorited: string;
  sort_id: number;
  resolved_title: string;
  resolved_url: string;
  excerpt: string;
  is_article: "0" | "1";
  is_index: "0" | "1";
  has_video: "0" | "1" | "2";
  has_image: "0" | "1" | "2";
  word_count: string;
  lang: string;
  amp_url: string;
  top_image_url: string;
  domain_metadata: {
    name: string;
    logo: string;
    greyscale_logo: string;
  };
  listen_duration_estimate: number;
}

type ModifyAction =
  | "add"
  | "archive"
  | "favorite"
  | "readd"
  | "unfavorite"
  | "delete"
  | "tags_add"
  | "tags_remove"
  | "tags_replace"
  | "tags_clear"
  | "tags_rename"
  | "tags_delete";
export interface ModifyRequest {
  action?: ModifyAction;

  // Url should only be used when item_id is not available.
  url?: string;
  item_id?: number;
  time?: string;
  tags?: string;

  // to rename tags
  old_tag?: string;
  new_tag?: string;
}

export interface AddItem {
  url: string;
  title?: string;
  tags?: string;
  tweet_id?: string;
}

export interface ModifyResponse {
  status: "0" | "1";
  action_results: [boolean];
}

export default class GetPocket {
  consumer_key: string;
  access_token: string | null;
  constructor(consumer_key: string, access_token: string | null) {
    this.consumer_key = consumer_key;
    this.access_token = access_token;
  }

  async get(options: GetOptions = {}): Promise<GetResponse> {
    return this._get(ROOT_URL + GET_URL, options);
  }

  // Send  non-homogeneous request
  async modify(options: Array<ModifyRequest>): Promise<ModifyResponse> {
    return this._send(ROOT_URL + SEND_URL, options);
  }

  // Send homogeneous request
  async _modify(
    action: ModifyAction,
    options: Array<ModifyRequest>,
  ): Promise<ModifyResponse> {
    options = options.map((request) => ({
      ...request,
      action: "archive",
    }));
    return this.modify(options);
  }

  async archive(options: Array<ModifyRequest>): Promise<ModifyResponse> {
    return this._modify("archive", options);
  }

  async add(options: Array<ModifyRequest>): Promise<ModifyResponse> {
    return this._modify("add", options);
  }

  async addOne(url: string) {
    return this._get(ROOT_URL + ADD_URL, { url });
  }

  async _get(url: string, options: object) {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...options,
        consumer_key: this.consumer_key,
        access_token: this.access_token,
      }),
    });
    if (res.status !== 200) {
      throw new Error("Error " + res.status);
    }
    return res.json();
  }
  async _send(_url: string, actions: object) {
    const url = ROOT_URL + SEND_URL +
      `?actions=${
        encodeURIComponent(JSON.stringify(actions))
      }&access_token=${this.access_token}&consumer_key=${this.consumer_key}`;
    const res = await fetch(url, { headers });
    if (res.status !== 200) {
      throw new Error("Error " + res.status);
    }
    let json = await res.json();
    if (json.status !== 1) {
      throw Error("Error: " + json.action_results);
    }
    return json;
  }
}
