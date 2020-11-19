<template>
  <div>
  <style id="accordion-style" type="text/css"></style>
  <trash :area="currentArea" />
  <select class="form-control" id="select_area" @change="onChangeSelect">
    <option value="-1">地域を選択してください</option>
    <option v-for="(area,key) in areaModels" :value="key" :key="key">{{area.label}}</option>
  </select>
    <div class="accordion" id="accordion3">
      <b-button variant="link" class="accordion-toggle-top" v-b-toggle.collapse-1>5374.jpについて</b-button>
      <b-collapse id="collapse-1" class="mt-2">
        <b-card>
          <!-- <p class="card-text">Collapse contents Here</p> -->
          <div id="help">
            ゴミの問題は、どの地域でも深刻になりつつあります。
            Code for Kanazawaでは、先ずは正しいゴミの捨て方に注目しました。
            目的と使い方は、とてもシンプルです。
          </div>
          <h2>目的</h2>
          <p>
            「いつ、どのゴミが収集されているのか？」
            例えばお引っ越しをされた場合や、新しく金沢市に住むことになった時、このアプリを使えば、すぐに分かるようにデザインされています。
          </p>
          <h2>使い方</h2>
          <h3>色でゴミのジャンルを表示</h3>
          <p>一番近いゴミの日とジャンルを上から順に表示しています。</p>
          <h3>捨てる事が可能なゴミ</h3>
          <p>ゴミのジャンルをタップすると、捨てることが可能なゴミの一覧を見ることができます</p>
          <h3>設定</h3>
          <p>お住まいの地域を選択することで、ゴミ収集日が自動的に更新されます。</p>
          <div id="caption">
            <h4>提供されるゴミ情報について</h4>
            <p>金沢市が公開しているデータからCfKが独自に解析し、アプリに実装しました。</p>
            <h4>ライセンスについて</h4>
            <p>本アプリの著作権はCode for Kanazawaに帰属します。</p>
          </div>
          <div id="cfk">
            <h3>Code for Kanazawaについて</h3>
            <p>コードで、世界をHappyに。<br />
各地域には様々な課題があり、解決するためのコミュニティ（団体）も数多くあります。<br />
課題の中には、ITやデザインの力で解決できるものも多くありますが、全てのコミュニティにそのスキル（技術）が備わっているわけではありません。<br /><br />
Code for Kanazawa（CfK）は、市民の課題を集め、その課題を整理・分析した上で、メンバーが実際に課題解決となるソフトウェアやハードウェア（仕組みや方法）を開発します。<br />
私たちは、デザインをして、ソフトウェアコードを書き、課題を解決するサービスを完成させるのです。さらに、そのサービスを提供し続ける力も持ちます。<br /><br />
CfKは市民のための組織です。行政や民間企業の影響を受けずに中立・公益の立場から物事を判断するよう心がけています。<br /><br />
公式サイト<br />
<a href="http://www.codeforkanazawa.org/">http://www.codeforkanazawa.org/</a>
            </p>
          </div>
        </b-card>
      </b-collapse>
    </div>
  <!-- <div class="accordion" id="accordion3">
    <div class="accordion-group-top">
      <div class="accordion-heading">
        <a class="accordion-toggle-top" data-toggle="collapse" data-parent="#accordion3" href="#collapse3_0">5374.jpについて</a>
      </div>
      <div id="collapse3_0" class="accordion-body collapse">
        <div class="accordion-inner">

        </div>
      </div>
    </div>
  </div> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { BCollapse } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.component('b-collapse', BCollapse)

import { CardPlugin } from 'bootstrap-vue'
Vue.use(CardPlugin)
import { ButtonPlugin } from 'bootstrap-vue'
Vue.use(ButtonPlugin)

import { AreaModel, TrashModel, RemarkModel, DescriptionModel, TargetRowModel } from '@/scripts/script'
import { MaxDescription } from '@/scripts/setting'

import trash from '~/components/trash.vue'

export default Vue.extend({
  // head: {
  //   script: [
  //   ],
  // },
  components: {
    trash
  },
  data:function(){
    return {
      center_data: [],
      descriptions: [],
      areaModels: new Array<AreaModel>(),
      remarks: [],
      currentArea: new AreaModel(),
    }
  },
  created:function(){
    //this.csvToArray('/data/area_days.csv',null);
    this.createMenuList();
    this.updateAreaList();
  },
  methods:{
    csvToArray:function(filename: string,cb: any){
      try{
        axios.get(filename)
        .then(function (response) {
          //console.log("axios:",response);
          let csvdata =  response.data;
          var line = csvdata.split("\n"),
              ret = [];
          for (var i in line) {
            //空行はスルーする。
            if (line[i].length == 0) continue;

            var row = line[i].split(",");
            ret.push(row);
          }
          //console.log("csv ret:",ret);
          cb(ret);
        }).catch(function (error) {
          console.log("axios error:",error);
        });
      }catch(e){
        console.log(e);
      }
    },
    updateAreaList: function(){
      let self = this;
      // var MaxDescription = 9;
      console.log("MaxDescription",MaxDescription)
      self.csvToArray("data/area_days.csv", function(tmp: any) {
        //console.log(tmp)
        var area_days_label = tmp.shift();
        for (var i in tmp) {
          var row = tmp[i];
          var area = new AreaModel();
          area.label = row[0];
          area.centerName = row[1];

          self.areaModels.push(area);
          console.log("self.areaModels",self.areaModels);
          // ２列目以降の処理
          for (var r = 2; r < 2 + MaxDescription; r++) {
            if (area_days_label[r]) {
              var trash = new TrashModel(area_days_label[r], row[r], self.remarks);
              self.putDescription(trash);
              area.trash.push(trash);
            }
          }
          console.log("area.trash",area.trash);

          //ラベルが同じになるdescriptionを取得

        }
      });
    },
    createMenuList: function(){
      let self = this;
      // 備考データを読み込む
      this.csvToArray("data/remarks.csv", function(data) {
        data.shift();
        for (var i in data) {
          self.remarks.push(new RemarkModel(data[i]));
        }
        console.log("remarks",self.remarks);
      });
      this.csvToArray("data/description.csv", function(data) {
        data.shift();
        for (var i in data) {
          self.descriptions.push(new DescriptionModel(data[i]));
        }
        console.log("description",self.descriptions);
      });
    },
    putDescription: function(trash:TrashModel){
      //ラベルが同じになるdescriptionを取得
      for (var d_no in this.descriptions) {
        var description = this.descriptions[d_no];
        if (description.label == trash.label) {
          trash.description = description;
          break;
        }
      }
    },
    onChangeSelect: function(e){
      let row_index = parseInt(e.target.value);
      console.log("row_index",row_index);
      if (row_index == -1) {
        // $("#accordion").html("");
        this.setSelectedAreaName("");
        return;
      }
      this.setSelectedAreaName(this.areaModels[row_index].label);
      this.currentArea = this.areaModels[row_index];
    },
    getSelectedAreaName: function() {
      return localStorage.getItem("selected_area_name");
    },
    setSelectedAreaName: function(name: string) {
      localStorage.setItem("selected_area_name", name);
    }
  }
})
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
