export interface PharmaciesResponse {
  apiVersion: string;
  data: Data;
}

export interface Data {
  items: Store[];
}

export interface Store {
  id: string;
  distance: number;
  name: string;
  phone: string;
  address: string;
  maskAdult: number;
  maskChild: number;
  available: string;
  customNote: string;
  website: string;
  note: string;
  longitude: number;
  latitude: number;
  servicePeriods: string;
  serviceNote: string;
  county: string;
  town: string;
  cunli: string;
  updated: string | Date;
  adultLevel: string;
  childLevel: string;
}

//[{"Name":"中美藥局","Phone":"02 -27627468","Address":"台北市松山區富錦街531號","MaskAdult":42,"MaskChild":13,"Updated":"2020/02/04 18:30","Available":"星期一上午看診、星期二上午看診、星期三上午看診、星期四上午看診、星期五上午看診、星期六上午看診、星期日上午看診、星期一下午看診、星期二下午看診、星期三下午看診、星期四下午看診、星期五下午看診、星期六下午看診、星期日下午看診、星期一晚上看診、星期二晚上看診、星期三晚上看診、星期四晚上看診、星期五晚上看診、星期六晚上看診、星期日晚上看診","Note":"營業時間如有異動,以藥局公告為準","Coordinates":[121.565481,25.061285]}]
