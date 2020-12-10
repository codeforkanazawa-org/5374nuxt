<template>
    <div id="accordion">
      <div class="accordion-group" v-for="(data, key) in trashList" :key="key" :style="data.description.background">
        <div class="accordion-heading">
          <a class="accordion-toggle" v-b-toggle="data.collapse" href="#collapse">
            <div class="left-day">{{data.getLeftDay()}}</div>
            <div class="accordion-table">
              <p class="text-center">{{data.label}}</p>
            </div>
            <h6><p class="text-left date">{{data.getDateLabel()}}</p></h6>
          </a>
        </div>

        <!-- Element to collapse -->
        <b-collapse :id="data.collapse">
          <!-- <b-card> -->
            <div id="collapse" class="accordion-body">
              <div class="accordion-inner">
                <h3>{{data.description.description}}</h3>
                <div v-for="(list, furigana) in data.description.targetMap" :key="furigana">
                  <h4 class="initials">{{furigana}}</h4>
                  <ul>
                    <li v-for="(item,num) in list" :key="num" style="list-style:none;">
                      <div>{{item.name}}</div>
                      <div class="note">{{item.notice}}</div>
                    </li>
                  </ul>
                </div>
                <div class="targetDays"></div>
              </div>  
            </div>
          <!-- </b-card> -->
        </b-collapse>
      </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { BCollapse } from 'bootstrap-vue'

import '../static/css/bootstrap.min.css'
import '../static/css/custom.css'
//import '/css/bootstrap-vue.css'

// Install BootstrapVue
Vue.use(BootstrapVue)

Vue.component('b-collapse', BCollapse)

import { CardPlugin } from 'bootstrap-vue'
Vue.use(CardPlugin)

import { AreaModel,TrashModel } from '@/scripts/script'

export default Vue.extend({
  props: {
    area: AreaModel,
  },
  watch:  {
    area: {
      handler: function () {
        //console.log("area",this.area);
        let areaModel = this.area;
        var today = new Date();
        //直近の一番近い日付を計算します。
        areaModel.calcMostRect();
        //トラッシュの近い順にソートします。
        areaModel.sortTrash();
        this.trashList = areaModel.trash;
        console.log("this.trashList",this.trashList);
      },
    }
  },
  data:function(){
    return {
      trashList: new Array<TrashModel>(),
    }
  },
  created:function(){
  }
});
</script>

<style scoped>
a,
a:hover {
	color: white;
	text-decoration: none;
}
.accordion-inner {
	padding: 9px 15px;
  border-top:1px solid #e5e5e5;
}

h3 {
  font-size:24px;
}

#accordion .accordion-inner h3 {
    color: white;
}

/*!
 * ゴミ収集の情報
 */
#accordion .accordion-group {
	margin-bottom: 0;
	border: 0;
	border-radius: 0;
}
#accordion .accordion-group h6 {
	position: absolute;
	bottom: 0px;
	left: 10px;
	margin: 0;
}
#accordion .accordion-inner ul {
	color: #ffffff;
}
#accordion .accordion-heading .accordion-table {
	display: table-cell;
	vertical-align: middle;
	text-align: center;
	width: 80%;
	font-size: 22px;
}
#accordion .accordion-heading .accordion-toggle {
	position: relative;
	display: table;
	padding: 0;
	width: 100%;
	height: 119px;
}
/* 相対日付 (左肩) */
#accordion .left-day {
	font-size: 1.5em;
	color: white;
	position: absolute;
	padding-left: 10px;
}
/* 指定日・直近日付 */
#accordion .date {
}
/* 分別方法の頭文字(ふりがな) */
#accordion .initials {
	color: #ffffff;
}
/* ゴミを捨てるときの注意事項 */
#accordion .note {
	font-size: 10px;
}

/*!
 * 備考欄
 */
#accordion2 {
	display: none;
}
#accordion2 .accordion-inner {
	text-align: center;
}



/*!
 * 5374.jpについて
 */
#accordion3 a.accordion-toggle-top {
	color: #000000;
	height: 22px;
	display: block;
	margin: 0;
	text-align: left;
	font-size: 25px;
	margin: 15px 0 15px 15px;
}
#accordion3 a.accordion-toggle-top:hover {
	color: #000000;
}
#accordion3 h2 {
	font-size: 25px;
	margin-top: 40px;
}
#accordion3 h3 {
	font-weight: bold;
	font-size: 16px;
	margin-top: 15px;
}
#accordion3 #cfi {
	border-top: 1px solid black;
}
#accordion3 #cfk {
	border-top: 1px solid black;
}
#accordion3 #caption {
	font-size: 12px;
	color: #7F7F7F;
	margin-top: 30px;
}
#accordion3 #caption h4 {
	font-size: 12px;
	font-weight: bold;
}
#accordion3 #help {
	margin-left: 5px;
}
</style>