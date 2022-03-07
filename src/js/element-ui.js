import Vue from 'vue';
import {
    Form, FormItem, Input, Button, Container, Aside, Main, Header,
    Menu, MenuItem, Submenu, MenuItemGroup, Tag, Divider, Card,
    Tabs, TabPane, Carousel, CarouselItem, Image, ButtonGroup, Dialog,
    Upload,Option,Select,Row,Col,Message,MessageBox,Loading,Alert,
    Notification,Pagination
} from 'element-ui';
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Header)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(Card)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Image)
Vue.use(ButtonGroup)
Vue.use(Dialog)
Vue.use(Upload)
Vue.use(Option)
Vue.use(Select)
Vue.use(Row)
Vue.use(Col)
Vue.use(Loading)
Vue.use(Alert)
Vue.use(Pagination)

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;