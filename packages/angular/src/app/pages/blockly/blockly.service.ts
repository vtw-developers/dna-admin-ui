export interface Block {
  id: string;
  author: string;
  registerDate: Date;
  blockJson: string;
  data: string;
  dataName: string;
  dataDetail: string;
  pythonData: string;
  comment: string;
  finished: Boolean;
  finishDate: Date;
  used: Boolean;
}
