const bm = require('../../utils/common.js')
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp()
Component({

  properties:{
    fastResume_rate:{
      type: Number,
      value:0
    },
    rest: {
      type: Number,
      value: 0
    },
    fastResume_text: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    
  }

})