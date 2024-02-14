const apiUrl = "https://vue3-course-api.hexschool.io";
const path = "xianbei";

const {createApp} = Vue;
import productModal from "./productModel.js";


const app = createApp({
  data(){
    return {
      isLoading: false,
      products:[],
      product:{},
      carts:[],
      user:{
        name:"",
        email:"",
        tel:"",
        address:"",
      },
      message:"",    
    };    
  },
  
  components:{
    productModal,
  },

  computed:{
    total(){
      let total = 0;
      this.carts.forEach((item)=>{
        total += item.final_total
      });
      return total;
    },
  },

  methods:{
    getProducts(){
      this.isLoading = true;
      const getUrl = `${apiUrl}/v2/api/${path}/products`;
      axios.get(getUrl)
      .then((res)=>{
        this.products = res.data.products;
        this.isLoading = false;
      })
      .catch((err)=>{
        console.log(err);
      })
    },
    getCarts(){
      this.isLoading = true;
      const getCartUrl = `${apiUrl}/v2/api/${path}/cart`;
      axios.get(getCartUrl)
      .then((res)=>{
        this.carts = res.data.data.carts;
        this.isLoading = false;
      })
      .catch((err)=>{
        console.log(err);
      })
    },
//cart CRUD
    addCart(id){
      this.isLoading = true;
      const addCartUrl = `${apiUrl}/v2/api/${path}/cart`
      let addCart = {};
      //如果傳入參數是String，表示是從根元件加入購物車
      //這時設定qty=1
      if (typeof id === 'string'){
        //接收id資料並設定qty=1,
        addCart = {
          data:{
            product_id: id,
            qty:1,
          }         
        };
      }else {
        //若傳入參數是obj(非string)，表示是從modal中加入購物車
        //從modal加入購物車，接收id和qty資料
        addCart = {...id}
      }
      axios.post(addCartUrl,addCart)
      .then((res)=>{
        this.getCarts();
        //新增成功後關掉modal
        this.$refs.modal.closeModal();
      })
      .catch((err)=>{
        console.log(err);
      });      
    },
    //在購物車修改產品數量用blur監聽
    updateCart(cart){     
      this.isLoading = true; 
      const cartId = cart.id;      
      const updateData = {
        data:{
          product_id: cart.product_id,
          qty: cart.qty,
        },
      };
      const updateCartUrl = `${apiUrl}/v2/api/${path}/cart/${cartId}`;
      axios.put(updateCartUrl,updateData)
      .then((res)=>{
        this.getCarts()
      })
      .catch((err)=>{
        console.log(err);
      });
    },
    deleteCart(id){
      this.isLoading = true;
      const deleteCartUrl = `${apiUrl}/v2/api/${path}/cart/${id}`;
      axios.delete(deleteCartUrl)
      .then((res)=>{
        console.log(res);
        this.getCarts();
      })
      .catch((err)=>{
        console.log(err);
      });
    },
    deleteAllCart(){
      this.isLoading = true;
      const deleteAllCartUrl = `${apiUrl}/v2/api/${path}/carts`;
      axios.delete(deleteAllCartUrl)
      .then((res)=>{
        this.getCarts()
      })
      .catch((err)=>{
        console.log(err);
      });
    },

    //用ref打開modal，並將選取資料傳入modal中
    seeDetail(id){
      this.products.forEach((item)=>{
        if(item.id == id){
          this.product = item
        }
      });
      //雖然有API可以使用，但因為已有所有產品資料，所以用forEach找會比較快
      //打開modal並將資料傳入model中
      this.$refs.modal.openModal(this.product);
    },

    submitOrder(){      
      const orderData = {
        data:{
          user:{...this.user},
          message:this.message,
        }           
      };
      const orderUrl = `${apiUrl}/v2/api/${path}/order`; 
      if(this.carts.length == 0){
        alert("購物車是空的");
      }else{
        this.isLoading = true;       
        axios.post(orderUrl, orderData)
        .then((res)=>{
          location.reload();
        })
        .catch((err)=>{});
      }      
    },      
  },

  mounted(){
    this.getProducts();
    this.getCarts();    
  },
});


//VueLoading
app.component('loading',VueLoading.Component);

//註冊全域的表單驗證元件（VForm, VField, ErrorMessage）
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
//定義規則：全部加入(CDN 版本)
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
//載入中文錯誤訊息
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

app.mount("#app");