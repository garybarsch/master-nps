class Filter {
  constructor(data){


    let d = {};
    for(let i=0; i<data.length; i++){
      d[data[i].property] = data[i].value;
    }

    this.data = Object.assign({}, d);

    d = null;
  }
  getFilterItem(itemName){
    return this.data[itemName];
  }
  getFilterProperties(){
    return Object.keys(this.data);
  }
  getFilterItems(){
    return this.data;
  }
  toJSON(){
    return this.getFilterItems;
  }
}

module.exports = Filter;
