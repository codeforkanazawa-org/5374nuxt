/**
  エリア(ごみ処理の地域）を管理するクラスです。
*/

export class  AreaModel {
  constructor() {
    this.label = '';
    this.centerName = '';
    this.center = '';
    this.trash = new Array();
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
      this.trash[i].calcMostRect(this);
    }
  }
}
