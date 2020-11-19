/**
  エリア(ごみ処理の地域）を管理するクラスです。
*/

export class  AreaModel {
  constructor() {
    this.label = '';
    this.centerName = '';
    this.center = '';
    this.trash = [];
  }
  label: string;
  centerName: string;
  center: string;

  trash: Array<any>;
  /**
  各ゴミのカテゴリに対して、最も直近の日付を計算します。
  */
  calcMostRect() {
    for (var i = 0; i < this.trash.length; i++) {
      //this.trash[i].calcMostRect(this);
    }
  }
}

export class  TrashModel {
  constructor(_lable:string, _cell:string, remarks:any) {
    this.label = _lable;
    this.dayLabel = '';
    this.mostRecent = null;
    this.dayList =[];
    this.mflag = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.remarks = remarks;
    this.description = null;
    this.regularFlg = 1;      // 定期回収フラグ（デフォルトはオン:1）

    //セルにコロンがあるかどうかスペースがあるかどうかで対象月を分ける
    var monthSplitFlag=_cell.search(/:/)>=0
    var mm: Array<string>;
    if (monthSplitFlag) {
      var flag = _cell.split(":");
      this.dayCell = flag[0].split(" ");
      mm = flag[1].split(" ");
    } else if (_cell.length == 2 && _cell.substr(0,1) == "*") {
      this.dayCell = _cell.split(" ");
      mm = [];
    } else {
      this.dayCell = _cell.split(" ");
      mm = ["4", "5", "6", "7", "8", "9", "10", "11", "12", "1", "2", "3"];
    }
    for (var m in mm) {
      this.mflag[parseInt(mm[m]) - 1] = 1;
    }

    

    var result_text = "";
    var today = new Date();
  }
  label: string;
  dayLabel: string;
  mostRecent: Date | null;
  dayList: Array<any>;
  mflag: Array<number>;
  remarks: Array<any>;
  description: DescriptionModel | null;
  regularFlg: number; 
  dayCell: Array<string>;
}

export class  RemarkModel {
  constructor(data:Array<string>) {
    this.id = data[0];
    this.text = data[1];
  }
  id: string;
  text: string;
}

export class  DescriptionModel {
  constructor(data:Array<string>) {
    this.targets = [];

    this.label = data[0];
    this.sublabel = data[1];//not used
    this.description = data[2];//not used
    this.styles = data[3];
    this.background = "background-color:" + data[4];
  }
  targets: Array<string>;  
  label: string;
  sublabel: string;
  description: string;
  styles: string;
  background: string;
}

export class  TargetRowModel {
  
}

export class  CenterModel {
  
}