export default {
  props:['product',],
  data(){
      return{
        modal:null,
        productData:{}
      };
  },
  methods:{
    openModal(data){
      //接收上層傳入的資料並打開modal
      this.modal.show();
      this.productData = {...data};
    },
    //加入購物車，將ID和qty用emit傳到上層
    addToCart(id){
      const cartData = {
        data:{
          product_id: id,
          qty: this.productData.num
        },
      };
      this.$emit('add',cartData);
    },
    closeModal(){
      this.productData = {};
      this.modal.hide();
    },
  },
  mounted(){
    this.modal = new bootstrap.Modal(this.$refs.productModal);
  },
  template:'#userProductModal',
};
