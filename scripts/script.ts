import { MaxMonth,SkipSuspend,WeekShift } from '@/scripts/setting'


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

  trash: Array<TrashModel>;
  /**
  各ゴミのカテゴリに対して、最も直近の日付を計算します。
  */
  calcMostRect() {
    for (var i = 0; i < this.trash.length; i++) {
      this.trash[i].calcMostRect(this);
    }
  }

  /**
    休止期間（主に年末年始）かどうかを判定します。
  */
  isBlankDay(currentDate) {
    return false;
  }

  sortTrash() {
    this.trash.sort(function(a, b) {
      if (a.mostRecent === undefined) return 1;
      if (b.mostRecent === undefined) return -1;
      var amr = a.mostRecent;
      var bmr = b.mostRecent;
      if (!amr && !bmr) {
        return 0;
      } else if (amr && !bmr) {
        return -1;
      } else if (!amr && bmr) {
        return 1;
      }
      var at = amr.getTime();
      var bt = bmr.getTime();
      if (at < bt) return -1;
      if (at > bt) return 1;
      return 0;
    });
  }
}

export class  TrashModel {
  constructor(_lable:string, _cell:string, remarks:any, index:number) {
    this.label = _lable;
    this.dayLabel = '';
    this.mostRecent = null;
    this.dayList =[];
    this.mflag = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.remarks = remarks;
    this.description = null;
    this.regularFlg = 1;      // 定期回収フラグ（デフォルトはオン:1）
    this.collapse = "collapse-" + index;

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

    //日付に合わせてゴミの日の表記を変える
    for (var j in this.dayCell) {
      if (this.dayCell[j].length == 1) {
        result_text += "毎週" + this.dayCell[j] + "曜日 ";
      } else if (this.dayCell[j].length == 2 && this.dayCell[j].substr(0,1) != "*") {
        result_text += "第" + this.dayCell[j].charAt(1) + this.dayCell[j].charAt(0) + "曜日 ";
      } else if (this.dayCell[j].length == 2 && this.dayCell[j].substr(0,1) == "*") {
      } else if (this.dayCell[j].length == 10 && this.dayCell[j].substr(0,1) == "隔") {
        /**** MOD: PICK biweek, Ex:隔月20140401 ****/
        /****ADD****/
        result_text += "隔週" + this.dayCell[j].charAt(1) + "曜 ";
        this.regularFlg = 2;      // 隔週フラグ
        /****ADD****/
      } else {
        // 不定期回収の場合（YYYYMMDD指定）
        result_text = "不定期 ";
        this.regularFlg = 0;  // 定期回収フラグオフ
      }
    }
    if (monthSplitFlag){
      var monthList="";
      for (var m in this.mflag) {
        if (this.mflag[m]){
          if (monthList.length>0){
            monthList+=","
          }
          //mを整数化
          monthList+=((m-0)+1)
        }
      };
      monthList+="月 "
      result_text=monthList+result_text
    }
    this.dayLabel = result_text;
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
  collapse: string;

  getDateLabel() {
    if (this.mostRecent === undefined) {
	    return this.getRemark() + "不明";
    }
    var result_text = this.mostRecent.getFullYear() + "/" + (1 + this.mostRecent.getMonth()) + "/" + this.mostRecent.getDate();
    return this.getRemark() + this.dayLabel + " " + result_text;
  }

  getRemark = function getRemark() {
    var ret = "";
    this.dayCell.forEach(function(day){
      if (day.substr(0,1) == "*") {
        this.remarks.forEach(function(remark){
          if (remark.id == day.substr(1,1)){
            ret += remark.text + "<br/>";
          }
        });
      };
    });
    return ret;
  }

  calcMostRect(areaObj) {
    var day_mix = this.dayCell;
    var result_text = "";
    var day_list = new Array();

    // 定期回収の場合
    if (this.regularFlg == 1) {

      var today = new Date();

      // 12月 +3月 を表現
      for (var i = 0; i < MaxMonth; i++) {

        var curMonth = today.getMonth() + i;
        var curYear = today.getFullYear() + Math.floor(curMonth / 12);
        var month = (curMonth % 12) + 1;

        // 収集が無い月はスキップ
        if (this.mflag[month - 1] == 0) {
            continue;
        }
        for (var j in day_mix) {
          //休止期間だったら、今後一週間ずらす。
          var isShift = false;

          //week=0が第1週目です。
          for (var week = 0; week < 5; week++) {
            //4月1日を起点として第n曜日などを計算する。
            var date = new Date(curYear, month - 1, 1);
            var d = new Date(date);
            //コンストラクタでやろうとするとうまく行かなかった。。
            //
            //4月1日を基準にして曜日の差分で時間を戻し、最大５週までの増加させて毎週を表現
            d.setTime(date.getTime() + 1000 * 60 * 60 * 24 *
              ((7 + this.getDayIndex(day_mix[j].charAt(0)) - date.getDay()) % 7) + week * 7 * 24 * 60 * 60 * 1000
            );
            //年末年始休暇のスキップ対応
            if (SkipSuspend) {
              if (areaObj.isBlankDay(d)) {
                continue;
              }
            }
            //年末年始のずらしの対応
            //休止期間なら、今後の日程を１週間ずらす
            if (areaObj.isBlankDay(d)) {
            if (WeekShift) {
                isShift = true;
              } else {
                continue;
              }
            }
      ////
            if (isShift) {
              d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000);
            }
            //同じ月の時のみ処理したい
            if (d.getMonth() != (month - 1) % 12) {
              continue;
            }
            //特定の週のみ処理する
            if (day_mix[j].length > 1) {
              if ((week != day_mix[j].charAt(1) - 1) || ("*" == day_mix[j].charAt(0))) {
                continue;
              }
            }

            day_list.push(d);
          }
        }
      }
      /****ASS****/
    } else if (this.regularFlg == 2) {
      // 隔週回収の場合は、basedateに指定初回日付をセット
      for (var j in day_mix) {
        var year = parseInt(day_mix[j].substr(2, 4));
        var month = parseInt(day_mix[j].substr(6, 2)) - 1;
        var day = parseInt(day_mix[j].substr(8, 2));
        var basedate = new Date(year, month, day);

        //week=0が第1週目です。
        for (var week = 0; week < 27; week++) {
          // basedate を起点に、最も近い偶数週目を計算する。
          var d = new Date(date);
          // basedate を基準に、最大53週まで増加させて隔週を表現
          d.setTime( basedate.getTime() + week * 14 * 24 * 60 * 60 * 1000 );
          //年末年始休暇のスキップ対応
          if (SkipSuspend) {
            if (areaObj.isBlankDay(d)) {
              continue;
            }
          }
          day_list.push(d);
        }
      }
    /***ADD*****/   
    } else {
      // 不定期回収の場合は、そのまま指定された日付をセットする
      for (var j in day_mix) {
        var year = parseInt(day_mix[j].substr(0, 4));
        var month = parseInt(day_mix[j].substr(4, 2)) - 1;
        var day = parseInt(day_mix[j].substr(6, 2));
        var d = new Date(year, month, day);
        if (d.toString() !== "Invalid Date") {
            day_list.push(d);
        }
      }
    }
    //曜日によっては日付順ではないので最終的にソートする。
    //ソートしなくてもなんとなりそうな気もしますが、とりあえずソート
    day_list.sort(function(a, b) {
      var at = a.getTime();
      var bt = b.getTime();
      if (at < bt) return -1;
      if (at > bt) return 1;
      return 0;
    })
    //直近の日付を更新
    var now = new Date();
    for (var i in day_list) {
      if (this.mostRecent == null && now.getTime() < day_list[i].getTime() + 24 * 60 * 60 * 1000) {
        this.mostRecent = day_list[i];
        break;
      }
    };

    this.dayList = day_list;
  }

  getDayIndex(str) {
    var day_enum = ["日", "月", "火", "水", "木", "金", "土"];
    for (var i = 0; i < day_enum.length; i++) {
      if (day_enum[i] == str) {
        return i;
      }
    };
    return -1;
  }

  getLeftDay(){
    //あと何日かを計算する処理です。
    var today = new Date();
    var leftDayText = "";
    if(this.mostRecent){
      console.log("this.mostRecent",this.mostRecent);
      var leftDay = Math.ceil((this.mostRecent.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (leftDay == 0) {
        leftDayText = "今日";
      } else if (leftDay == 1) {
        leftDayText = "明日";
      } else if (leftDay == 2) {
        leftDayText = "明後日"
      } else {
        leftDayText = leftDay + "日後";
      }
      return leftDayText;
    } else {
      console.log("this.mostRecent","不明");
      return "不明";
    }
  }
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
    this.targetMap = {};
    this.label = data[0];
    this.sublabel = data[1];//not used
    this.description = data[2];//not used
    this.styles = data[3];
    this.background = "background-color:" + data[4];
  }
  targets: Array<string>;
  targetMap:{};
  label: string;
  sublabel: string;
  description: string;
  styles: string;
  background: string;
}

export class  TargetRowModel {
  constructor(data:Array<string>) {
    this.label = data[0];
    this.name = data[1];
    this.notice = data[2];
    this.furigana = data[3];
  }
  label: string;
  name: string;
  notice: string;
  furigana: string;
}

export class  CenterModel {
  
}