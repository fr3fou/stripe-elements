import{r as o,c as s,h as t,H as l,d as i}from"./p-e4c324f8.js";import{c as n}from"./p-ccd0fe52.js";import"./p-8c01dd96.js";const e=class{constructor(t){o(this,t),this.onClose=s(this,"onClose",7),this.showCloseButton=!0,this.open=!1}async toggleModal(){this.open=!this.open}async openModal(){this.open=!0}async closeModal(){this.open=!1}disconnectedCallback(){this.onClose.emit()}componentDidLoad(){this.el.classList.add(n())}render(){const{open:o,showCloseButton:s}=this;return o?t(l,null,t("div",{class:"modal-row"+(o?" open":""),onClick:()=>this.closeModal()},t("div",{class:"modal-child",onClick:o=>o.stopPropagation()},t("slot",null),s?t("button",{class:"modal-close-button",onClick:()=>this.closeModal()},"Close"):null))):null}get el(){return i(this)}};e.style=":host{display:block}.modal-row{display:none}.modal-row.open{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:1ch;background:rgba(0, 0, 0, 0.3)}.modal-child{padding:1.5rem;background-color:#fff;width:100%}";export{e as stripe_element_modal}