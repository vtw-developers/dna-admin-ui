export interface Block {
  id: number;
  author: string;
  registerDate: Date;
  data: string;
  dataName: string;
  dataDetail: string;
  finished: Boolean;
  finishDate: Date;
}

