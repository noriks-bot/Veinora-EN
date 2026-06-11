function productVariantUrlFromOnlineStoreUrl(o,t){if(!(typeof o!="string"||!o.trim()||!t))try{const e=new URL(o);return e.searchParams.set("variant",String(t)),e.href}catch{return}}function normalizeStorefrontLanguageCode(o,t="EN"){if(!o||typeof o!="string")return t;const e=o.trim().replace(/_/g,"-").toLowerCase();if(!e)return t;const[n,r]=e.split("-");return n?n==="pt"&&r==="br"?"PT_BR":n==="pt"&&r==="pt"?"PT_PT":n==="zh"&&r==="cn"?"ZH_CN":n==="zh"&&r==="tw"?"ZH_TW":n.toUpperCase():t}function getShopifyStorefrontLanguageCode(o="EN"){return normalizeStorefrontLanguageCode(window.Shopify?.locale,o)}function upsellProductUrlJs(o,t){const e=productVariantUrlFromOnlineStoreUrl(o.onlineStoreUrl,t);return e||(o.handle&&t?`/products/${o.handle}?variant=${t}`:`/products?variant=${t}`)}const ON_CHANGE_DEBOUNCE_TIMER_DRAWER=300;function normalizeStorePath(o,t){const e=o&&String(o).trim();if(!e){const n=t&&String(t);return n&&n.replace(/\/cart\/?$/i,"/checkout")||"/checkout"}return/^https?:\/\//i.test(e)?e:e.replace(/^\/+/,"/")}function resolveFetchUrl(o){return typeof o=="string"?o:o instanceof Request?o.url:o instanceof URL?o.href:""}function isShopifyCartAddUrl(o){const t=resolveFetchUrl(o);return!t||t.includes("opens_cart=never")?!1:/\/cart\/add(\.js)?(\?|#|$)/i.test(t)}function debounce(o,t){let e;return function(...n){clearTimeout(e),e=setTimeout(()=>o.apply(this,n),t)}}class CartDrawerABTestManager{constructor(t){this.visitorId=t}hashString(t){let e=0;for(let n=0;n<t.length;n++){const r=t.charCodeAt(n);e=(e<<5)-e+r,e=e&e}return Math.abs(e)}getAssignedConfig(t){const e=t.configs||[],n=e.length;if(n<=1)return{configId:e[0]?.id||t.id,config:e[0]||t};const r=this.hashString(`${this.visitorId}_cart_${t.id}`),i=t.abTestDistribution;let a;return i?.mode==="custom"&&i.weights?a=this.selectConfigByWeight(r,e,i.weights):a=r%n,{configId:e[a].id,config:e[a]}}selectConfigByWeight(t,e,n){const r=t%100;let i=0;for(let a=0;a<e.length;a++)if(i+=n[e[a].id]||0,r<i)return a;return e.length-1}}class CartDrawerAnalyticsManager{constructor({visitorId:t,cartDrawerId:e,configId:n}){this.visitorId=t,this.cartDrawerId=e,this.configId=n,this.cachedUserData=null}getCachedUserData(){return this.cachedUserData||(this.cachedUserData={deviceType:this.getDeviceType(navigator.userAgent),browser:this.getBrowser(navigator.userAgent),platform:this.getPlatform(navigator.userAgent),screenResolution:`${screen.width}x${screen.height}`,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,language:navigator.language||navigator.userLanguage}),this.cachedUserData}getDeviceType(t){return/tablet|ipad|playbook|silk/i.test(t)?"tablet":/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(t)?"mobile":"desktop"}getBrowser(t){return t.includes("Firefox")?"Firefox":t.includes("SamsungBrowser")?"Samsung":t.includes("Opera")||t.includes("OPR")?"Opera":t.includes("Edg")?"Edge":t.includes("Chrome")?"Chrome":t.includes("Safari")?"Safari":"Unknown"}getPlatform(t){return t.includes("Win")?"Windows":t.includes("Mac")?"MacOS":t.includes("Linux")?"Linux":t.includes("Android")?"Android":t.includes("iPhone")||t.includes("iPad")?"iOS":"Unknown"}async send(t){try{const e=await fetch("/apps/moonbundle-analytics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);await e.json()}catch(e){console.warn("Failed to send analytics:",e)}}async sendView(t){await this.send({type:"view",subType:"cart_drawer",visitor_id:this.visitorId,cart_token:t,timestamp:new Date().toISOString(),shop:window.Shopify?.shop||"",cart_drawer_id:this.cartDrawerId,config_id:this.configId})}}class MoonBundleCartDrawer extends HTMLElement{static interceptorInitialized=!1;constructor(){super(),this.isOpen=!1,this.cart=null,this.isLoading=!1,this.svelteApp=null,this._isInitialized=!1;try{this.visitorId=localStorage.getItem("moonbundle_visitor_id"),this.visitorId||(this.visitorId="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){const n=Math.random()*16|0;return(e=="x"?n:n&3|8).toString(16)}),localStorage.setItem("moonbundle_visitor_id",this.visitorId))}catch{}const t=document.getElementById("moonbundle-cart-drawer-data");if(t)try{const e=JSON.parse(t.textContent),n=e.cartDrawer||{};if(this.cartDrawerId=n.id,n.configs&&n.configs.length>1&&this.visitorId){const r=new CartDrawerABTestManager(this.visitorId),{configId:i,config:a}=r.getAssignedConfig(n);this.cartDrawerProps={...n,...a},this.configId=i}else n.configs&&n.configs.length===1?(this.cartDrawerProps={...n,...n.configs[0]},this.configId=n.configs[0].id):(this.cartDrawerProps=n,this.configId=n.id);this.shopMoneyFormat=e.shopMoneyFormat||"",this.cartUrl=e.cartUrl||"/cart",this.checkoutUrl=normalizeStorePath(e.checkoutUrl||"/checkout",this.cartUrl),this.globalCustomCss=e.globalCustomCss||"",this.globalCustomJs=e.globalCustomJs||"",this.acceleratedCheckoutHtml=e.acceleratedCheckoutHtml||null}catch(e){console.error("Error parsing cart drawer data",e),this.cartDrawerProps={},this.shopMoneyFormat="",this.cartUrl="/cart",this.checkoutUrl=normalizeStorePath("/checkout","/cart"),this.globalCustomCss="",this.globalCustomJs="",this.acceleratedCheckoutHtml=null}else console.warn("MoonBundle: #moonbundle-cart-drawer-data tag not found"),this.cartDrawerProps={},this.shopMoneyFormat="",this.cartUrl="/cart",this.checkoutUrl=normalizeStorePath("/checkout","/cart"),this.globalCustomCss="",this.globalCustomJs="",this.acceleratedCheckoutHtml=null;this.analytics=new CartDrawerAnalyticsManager({visitorId:this.visitorId,cartDrawerId:this.cartDrawerId,configId:this.configId}),this.boundHandleClickQuantityBtn=this.handleClickQuantityBtn.bind(this),this.boundHandleRemoveClick=this.handleRemoveClick.bind(this),this.boundHandleChangeSelectVariant=this.handleChangeSelectVariant.bind(this),this.cartSelectors=["button.header-cart-toggle",".cart-icon:not(svg)","a[data-js-sidebar-handle]:not(a[href*='/search'])","#CartButton",".mini-cart-trigger","button[data-sidebar-id='CartDrawer']",".icon-cart:not(svg)","a.header--cart[data-drawer-view='cart-drawer']","div.minicart__button",".js-mini-cart-trigger","button.js-cart-button",".header-menu-cart-drawer","a.header--cart-count[data-drawer-view='cart-drawer']","a.area--cart.icon-button",".slide-menu-cart",".shopping-bag",".basket-icon",".cart-badge","[data-cart-widget]",".mini-cart-wrapper",".cart-dropdown",".shopping-cart-icon",".cart-summary",".cart-indicator",".basket-trigger","header-actions > cart-drawer-component",".shopping-cart a[href*='#cart']","button[drawer-to-open='cart-drawer']","a[role='button'][href='#drawer-cart']",".cart-link:not(div.header-icons):not(ul)","#sticky-app-client div[data-cl='sticky-button']","button.minicart-open","#cart-icon-bubble","[data-cartmini]","div.cart-text:has(.cart-count)","button.header__icon--cart","#CartButton-Desktop","a.header--cart-link[data-drawer-view='cart-drawer']","a[data-cart-toggle]",["a[href*='/cart']",":not([href^='//'])",":not([href*='/cart/change'])",":not([href*='/cart/add'])",":not([href*='/cart/clear'])",":not([href*='/products/cart'])",":not([href*='/collections/cart'])",":not([class*='upcart'])",":not([href*='/checkout'])",":not([href*='/discount'])",":not([href*='/cart/1'])",":not([href*='/cart/2'])",":not([href*='/cart/3'])",":not([href*='/cart/4'])",":not([href*='/cart/5'])",":not([href*='/cart/6'])",":not([href*='/cart/7'])",":not([href*='/cart/8'])",":not([href*='/cart/9'])"].join("")]}async init(){this._isInitialized||(this._isInitialized=!0,addCartDrawerStylesToHeader(),addPaymentIconAssetsToHeader(this.cartDrawerProps),this.setupThemeDrawerPassthrough(),this.setupCartDrawerEventsAndListeners(),this.cartDrawerProps.toggleUpsell?.isActive&&this.cartDrawerProps.toggleUpsell?.productId&&(this._toggleUpsellPromise=this._fetchToggleUpsellProduct()),this.cartDrawerProps.upsellCart?.isActive&&this.cartDrawerProps.upsellCart?.upsellMode!=="ai"&&this.cartDrawerProps.upsellCart?.upsellProducts?.length&&(this._upsellProductsPromise=this._fetchUpsellProducts()))}setupThemeDrawerPassthrough(){const t="moonbundle-rightdrawer-override",e=()=>{if(document.getElementById(t))return;const r=document.createElement("style");r.id=t,r.textContent="#modals-rightDrawer{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}",document.head.appendChild(r)},n=()=>{const r=document.getElementById(t);r&&r.remove()};document.body.addEventListener("sort-will-open",e),document.body.addEventListener("sort-is-closed",n)}setupCartDrawerEventsAndListeners(){document.addEventListener("click",t=>{(t.target.closest(".moonbundle-cart-drawer-close")||t.target.closest(".moonbundle-cart-drawer-continue"))&&(t.preventDefault(),this.isOnCartPage()?window.history.back():this.close()),t.target.closest(".moonbundle-cart-drawer-checkout")&&(t.preventDefault(),this.proceedToCheckout())}),document.addEventListener("click",t=>{t.target.closest(".moonbundle-cart-drawer-content")&&t.stopPropagation()}),document.addEventListener("click",t=>{t.target.classList.contains("moonbundle-cart-drawer-overlay")&&(this.isOnCartPage()||this.close())}),window.addEventListener("moonbundle-cart-updated",()=>{this.loadCart()}),window.addEventListener("pageshow",t=>{t.persisted&&this.loadCart()}),document.addEventListener("drawerOpen",t=>{const e=document.querySelector("moonbundle-cart-drawer-block");e&&e.open()}),this.initializeCartAddInterceptor()}initializeCartAddInterceptor(){if(!MoonBundleCartDrawer.interceptorInitialized)try{MoonBundleCartDrawer.interceptorInitialized=!0;const t=(r=!1)=>{const i=document.querySelector("moonbundle-cart-drawer-block");i&&i.open(r)};document.addEventListener("click",r=>{try{if(this.cartSelectors.some(a=>{try{return!!r.target.closest(a)}catch(l){return console.error("Error in cart drawer click interceptor:",l),!1}})){try{r.stopImmediatePropagation(),r.preventDefault(),r.stopPropagation()}catch(a){console.warn("MoonBundle: Error stopping event propagation",a)}t()}}catch(i){console.error("Error in cart drawer click interceptor:",i)}});const e=window.fetch;window.fetch=async function(r,i={}){if(!isShopifyCartAddUrl(r))return e.call(this,r,i);const a=document.querySelector("moonbundle-cart-drawer-block");a&&a.openImmediate();try{const l=await e.call(this,r,i);return l.ok&&t(!0),l}catch(l){return console.error("Error in cart drawer fetch interceptor:",l),e.call(this,r,i)}};const n=window.XMLHttpRequest;window.XMLHttpRequest=function(){const r=new n,i=r.open,a=r.send;return r.open=function(l,s,...c){return this._moonUrl=s,this._moonMethod=l,i.call(this,l,s,...c)},r.send=async function(l){if(!isShopifyCartAddUrl(this._moonUrl))return a.call(this,l);const s=document.querySelector("moonbundle-cart-drawer-block");s&&s.openImmediate();try{const c=a.call(this,l);return this.addEventListener("load",function(){this.status>=200&&this.status<300&&t(!0)},{once:!0}),c}catch(c){return console.error("Error in cart drawer XHR interceptor:",c),a.call(this,l)}},r}}catch(t){console.error("Failed to initialize cart drawer request interceptors:",t)}}async loadCart(){try{const t=await fetch(this.cartUrl+".js");t.ok||console.error("Erreur lors du chargement du panier:",t.status),this.cart=await t.json(),this.updateCartCountBubbleIcons(),this.syncCartAttributes();const e=this.cartDrawerProps.upsellCart.isActive&&this.cartDrawerProps.upsellCart.upsellMode!=="ai",n=this.cartDrawerProps.toggleUpsell.isActive;this.svelteApp?.updateCart&&this.svelteApp.updateCart(this.cart),this._skeletonActive&&(this._skeletonActive=!1,this.svelteApp?.setCartLoading&&this.svelteApp.setCartLoading(!1)),await Promise.all([this.enrichCartWithGraphQLDatas(),e?this.enrichCartWithUpsellProducts():Promise.resolve(),n?this.enrichCartWithToggleUpsell():Promise.resolve()]),setTimeout(()=>this.bindAllEvents(),0)}catch(t){console.error("Erreur lors du chargement du panier:",t),this._skeletonActive&&(this._skeletonActive=!1,this.svelteApp?.setCartLoading&&this.svelteApp.setCartLoading(!1))}}async _fetchToggleUpsellProduct(){const e=await fetch("/api/2025-10/graphql.json",{method:"POST",headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":this.cartDrawerProps.storefrontToken},body:JSON.stringify({query:`query getProductById($nodeId: ID!, $country: CountryCode, $locale: LanguageCode)
      @inContext(country: $country, language: $locale) {
      node(id: $nodeId) {
        ... on Product {
          title
          description
          featuredImage {
            url(transform: { preferredContentType: WEBP, maxHeight: 200, maxWidth: 200 })
          }
          variants(first: 1) {
            edges {
              node {
                id
                price { amount }
                compareAtPrice { amount }
                image {
                  url(transform: { preferredContentType: WEBP, maxHeight: 200, maxWidth: 200 })
                }
              }
            }
          }
        }
      }
    }`,variables:{nodeId:this.cartDrawerProps.toggleUpsell.productId,country:window.Shopify.country,locale:getShopifyStorefrontLanguageCode()}})});if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);const n=await e.json();return n.errors&&console.error("GraphQL Errors:",n.errors),n}async enrichCartWithToggleUpsell(){if(this.cart?.items?.length&&this.cartDrawerProps.toggleUpsell?.productId)try{const t=await(this._toggleUpsellPromise??this._fetchToggleUpsellProduct());if(!t?.data?.node){console.warn("ToggleUpsell product not found:",this.cartDrawerProps.toggleUpsell.productId);return}const e=t.data.node,n=e.variants?.edges?.[0]?.node;if(!n)return;this.svelteApp?.updateToggleUpsellProductData&&this.svelteApp.updateToggleUpsellProductData({variantId:n.id,title:e.title,description:e.description,imageSrc:e.featuredImage?.url||n.image?.url||"",compareAtPrice:n.compareAtPrice?parseFloat(n.compareAtPrice.amount):null,price:parseFloat(n.price.amount)})}catch(t){console.error("Erreur lors de l'enrichissement du panier avec toggle upsell:",t)}}debouncedClick=debounce(function(t,e,n){if(t==="decrease"&&n<=1)return;let r=n;t==="increase"?r=n+1:t==="decrease"&&(r=Math.max(1,n-1)),this.updateItemQuantity(e,r,t)}.bind(this),ON_CHANGE_DEBOUNCE_TIMER_DRAWER);debouncedOnChange=debounce(function(t){const e=t.target.dataset.itemKey,n=parseInt(t.target.value);n>0&&this.updateItemQuantity(e,n,"increase")}.bind(this),ON_CHANGE_DEBOUNCE_TIMER_DRAWER);handleRemoveClick(t){t.preventDefault(),t.stopPropagation();const e=t.target.closest(".moonbundle-cart-item-remove").dataset.itemKey;this.removeItem(e)}handleClickQuantityBtn(t){t.preventDefault(),t.stopPropagation();const e=t.currentTarget.dataset.action,n=t.currentTarget.dataset.itemKey,i=t.currentTarget.closest(".moonbundle-cart-item-quantity")?.querySelector(".moonbundle-quantity-input");if(!i)return;const a=parseInt(i.value);this.debouncedClick(e,n,a)}handleChangeSelectVariant(t){t.preventDefault(),t.stopPropagation();const e=t.target,n=e.dataset.itemKey,r=e.dataset.optionName,i=e.value,a=e.dataset.productId||"",l=e.dataset.idMerchandiseLine||"",s=e.dataset.optionId||"";let c=null;if(this.cart&&this.cart.items&&n){const h=this.cart.items.find(d=>d.key===n);if(h&&h.options_with_values){const d=h.options_with_values.find(p=>p.name===r);d&&(c=d.value)}}n&&this.handleVariantChange(n,r,i,a,l,s,c)}cleanupAllEvents=()=>{document.querySelectorAll(".moonbundle-quantity-btn").forEach(t=>{t.removeEventListener("click",this.boundHandleClickQuantityBtn)}),document.querySelectorAll(".moonbundle-quantity-input").forEach(t=>{t.removeEventListener("change",this.debouncedOnChange)}),document.querySelectorAll(".moonbundle-cart-item-remove").forEach(t=>{t.removeEventListener("click",this.boundHandleRemoveClick)}),document.querySelectorAll(".moonbundle-select__select").forEach(t=>{t.removeEventListener("change",this.boundHandleChangeSelectVariant)})};bindAllEvents(){this.cleanupAllEvents(),document.querySelectorAll(".moonbundle-quantity-btn").forEach(t=>{t.addEventListener("click",this.boundHandleClickQuantityBtn)}),document.querySelectorAll(".moonbundle-quantity-input").forEach(t=>{t.addEventListener("change",this.debouncedOnChange)}),document.querySelectorAll(".moonbundle-cart-item-remove").forEach(t=>{t.addEventListener("click",this.boundHandleRemoveClick)}),document.querySelectorAll(".moonbundle-select__select").forEach(t=>{t.addEventListener("change",this.boundHandleChangeSelectVariant)})}async updateItemQuantity(t,e,n){try{this.enableLoading(n,t);const r=await fetch(this.cartUrl+"/change.js",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:t,quantity:e})});if(r.ok)this.cart=await r.json(),this.triggerCartUpdate();else if(await this.handleCartError(r,"Erreur lors de la mise \xE0 jour de la quantit\xE9"))return}catch(r){console.error("Erreur lors de la mise \xE0 jour de la quantit\xE9:",r)}finally{this.disableLoading(n,t)}}async removeItem(t){try{this.enableLoading("remove",t);const e=await fetch(this.cartUrl+"/change.js",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:t,quantity:0})});if(e.ok)this.cart=await e.json(),this.triggerCartUpdate();else throw new Error("Erreur lors de la suppression de l'article")}catch(e){console.error("Erreur lors de la suppression de l'article:",e),this.loadCart()}finally{this.disableLoading("remove",t)}}updateCartCountBubbleIcons(){const t=document.getElementById("moonbundle-cart-count"),e=document.querySelector(".cart-count-bubble");if(t){const n=this.cart?this.cart.item_count:0;t.textContent=n}if(e){const n=this.cart?this.cart.item_count:0;if(n===0)e.style.display="none";else{e.style.display="";const r=e.querySelector('span[aria-hidden="true"]');r&&(r.textContent=n)}}}syncCartAttributes(){if(!this.cart||this._cartAttributesSynced)return;const t=this.cart.attributes||{};if(t.moonbundle_cart_drawer_id===this.cartDrawerId&&t.moonbundle_config_id===this.configId&&t.moonbundle_visitor_id===this.visitorId){this._cartAttributesSynced=!0;return}this._cartAttributesSynced=!0,fetch(this.cartUrl+"/update.js",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({attributes:{moonbundle_cart_drawer_id:this.cartDrawerId,moonbundle_config_id:this.configId,moonbundle_visitor_id:this.visitorId}})}).catch(()=>{})}enableLoading(t,e){this.svelteApp&&this.svelteApp.enableLoading&&this.svelteApp.enableLoading(t,e)}disableLoading(t,e){this.svelteApp&&this.svelteApp.disableLoading&&this.svelteApp.disableLoading(t,e)}async handleCartError(t,e){if(t.status===422){const n=await t.json();if(n.message==="Cart Error"&&n.description)return this.loadCart(),!0}throw new Error(e)}triggerCartUpdate(){window.dispatchEvent(new CustomEvent("moonbundle-cart-updated",{detail:{cart:this.cart}}))}async _fetchCartGraphQLData(t){const n=await fetch("/api/2025-10/graphql.json",{method:"POST",headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":this.cartDrawerProps.storefrontToken},body:JSON.stringify({query:`
      query getDetailsCartData($cartId: ID!, $country: CountryCode, $locale: LanguageCode) @inContext(country: $country, language: $locale) {
       cart(id: $cartId) {
         lines(first: 250) {
           edges {
             node {
               id
               merchandise {
                 ... on ProductVariant {
                   compareAtPrice { amount }
                   product {
                     id
                     ratingMetafield: metafield(namespace: "reviews", key: "rating") { value }
                     ratingCountMetafield: metafield(namespace: "reviews", key: "rating_count") { value }
                     options { name optionValues { name } }
                     sellingPlanGroups(first: 25) { nodes { ...sellingPlanGroupsFragment } }
                   }
                 }
               }
             }
           }
         }
       }
     }
     fragment sellingPlanGroupsFragment on SellingPlanGroup {
       name
       options { name values }
       sellingPlans(first: 10) {
         nodes {
           id name description
           options { name value }
           billingPolicy { ... on SellingPlanRecurringBillingPolicy { interval intervalCount } }
           deliveryPolicy { ... on SellingPlanRecurringDeliveryPolicy { interval intervalCount } }
           priceAdjustments {
             adjustmentValue {
               ... on SellingPlanFixedAmountPriceAdjustment { adjustmentAmount { amount } }
               ... on SellingPlanPercentagePriceAdjustment { adjustmentPercentage }
               ... on SellingPlanFixedPriceAdjustment { price { amount } }
             }
           }
           recurringDeliveries
         }
       }
     }
    `,variables:{cartId:`gid://shopify/Cart/${t}`,country:window.Shopify.country,locale:getShopifyStorefrontLanguageCode()}})});if(!n.ok)throw new Error(`HTTP error! status: ${n.status}`);return await n.json()}async enrichCartWithGraphQLDatas(){try{const t=await this._fetchCartGraphQLData(this.cart.token);if(t?.data?.cart?.lines){const e=t.data.cart.lines.edges.map(n=>{const r=n.node.id,i=n.node.merchandise,a=i?.product,l=a?.id,s=a?.ratingMetafield?.value,c=a?.ratingCountMetafield?.value;let h=null,d=null;if(s)try{const y=JSON.parse(s);h=parseFloat(y?.value??y)||null}catch{h=parseFloat(s)||null}c&&(d=parseInt(c)||null);const p=a?.options?.map(y=>({name:y.name,value:y.optionValues?.map(m=>m.name)||[]}))||[],g=(a?.sellingPlanGroups?.nodes||[]).map(y=>({name:y.name,options:y.options?.map(m=>({name:m.name,values:m.values||[]}))||[],sellingPlans:y.sellingPlans?.nodes?.map(m=>({id:m.id?parseInt(m.id.split("/").pop()):null,name:m.name,description:m.description,options:m.options?.map(f=>({name:f.name,value:f.value}))||[],billingPolicy:{interval:m.billingPolicy?.interval,intervalCount:m.billingPolicy?.intervalCount},deliveryPolicy:{interval:m.deliveryPolicy?.interval,intervalCount:m.deliveryPolicy?.intervalCount},priceAdjustments:m.priceAdjustments?.map(f=>({adjustmentValue:{adjustmentPercentage:f.adjustmentValue?.adjustmentPercentage,adjustmentAmount:f.adjustmentValue?.adjustmentAmount?.amount,price:f.adjustmentValue?.price?.amount}}))||[],recurringDeliveries:m.recurringDeliveries}))||[]}));return{productId:l||null,compare_at_price:i&&i.compareAtPrice?parseFloat(i.compareAtPrice.amount):null,optionsValuesEnriched:p,idMerchandiseLine:r,subscriptionData:g,reviewRating:h,reviewCount:d}});if(this.svelteApp?.updateCart&&this.svelteApp?.enrichCartWithGraphqlDatas){const n=this.svelteApp.enrichCartWithGraphqlDatas(this.cart,e);this.cart=n,this.svelteApp.updateCart(n)}}}catch(t){console.error("enrichCartWithGraphQLDatas error:",t)}}async _fetchUpsellProducts(){const n=`query getUpsellProducts( $ids: [ID!]!, $country: CountryCode, $locale: LanguageCode)
      @inContext(country: $country, language: $locale) {
        nodes(ids: $ids) {
          ... on Product {
            id
            title
            handle
            onlineStoreUrl
            ${this.cartDrawerProps?.upsellCart?.showUpsellReviews??!1?`ratingMetafield: metafield(namespace: "reviews", key: "rating") { value }
          ratingCountMetafield: metafield(namespace: "reviews", key: "rating_count") { value }`:""}
            options {
              name
              optionValues {
                name
              }
            }
            selectedOrFirstAvailableVariant {
              id
              availableForSale
              price {
                amount
              }
              compareAtPrice {
                amount
              }
              selectedOptions {
                name
                value
              }
              image {
                transformedUrl: url(
                  transform: {
                    preferredContentType: WEBP
                    maxHeight: 200
                    maxWidth: 200
                  }
                )
              }
            }
            sellingPlanGroups(first: 25) {
              nodes {
                ...sellingPlanGroupsFragment
              }
            }
          }
        }
      }

      fragment sellingPlanGroupsFragment on SellingPlanGroup {
        name
        options {
          name
          values
        }
        sellingPlans(first: 10) {
          nodes {
            id
            name
            description
            options {
              name
              value
            }
            billingPolicy {
              ... on SellingPlanRecurringBillingPolicy {
                interval
                intervalCount
              }
              __typename
            }
            deliveryPolicy {
              ... on SellingPlanRecurringDeliveryPolicy {
                interval
                intervalCount
              }
              __typename
            }
            priceAdjustments {
              adjustmentValue {
                __typename
                ... on SellingPlanFixedAmountPriceAdjustment {
                  adjustmentAmount {
                    amount
                  }
                }
                ... on SellingPlanPercentagePriceAdjustment {
                  adjustmentPercentage
                }
                ... on SellingPlanFixedPriceAdjustment {
                  price {
                    amount
                  }
                }
              }
            }
            recurringDeliveries
          }
        }
      }
      `,r={ids:this.cartDrawerProps.upsellCart.upsellProducts.map(a=>a.productId),country:window.Shopify.country,locale:getShopifyStorefrontLanguageCode()},i=await fetch("/api/2025-10/graphql.json",{method:"POST",headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":this.cartDrawerProps.storefrontToken},body:JSON.stringify({query:n,variables:r})});if(!i.ok)throw new Error(`HTTP error! status: ${i.status}`);return await i.json()}async enrichCartWithUpsellProducts(){try{const t=this.cartDrawerProps?.upsellCart?.showUpsellReviews??!1,e=await(this._upsellProductsPromise??this._fetchUpsellProducts());if(!e?.data?.nodes)return;const r=e.data.nodes.filter(i=>i!==null&&i.selectedOrFirstAvailableVariant!==null).map(i=>{const a=i.selectedOrFirstAvailableVariant,s=(i.sellingPlanGroups?.nodes||[]).map(p=>({sellingPlans:p.sellingPlans.nodes.map(u=>({id:u.id,name:u.name,description:u.description,options:u.options.map(g=>({name:g.name,value:g.value})),billingPolicy:u.billingPolicy,deliveryPolicy:u.deliveryPolicy,priceAdjustments:u.priceAdjustments}))}));let c=null,h=null;if(t){const p=i?.ratingMetafield?.value,u=i?.ratingCountMetafield?.value;if(p)try{const g=JSON.parse(p);c=parseFloat(g?.value??g)||null}catch{c=parseFloat(p)||null}u&&(h=parseInt(u)||null)}const d=parseInt(a.id.split("/").pop(),10);return{key:`${i.id}-${a.id}`,original_line_price:parseFloat(a.price.amount)*100,compare_at_price:a.compareAtPrice?parseFloat(a.compareAtPrice.amount)*100:void 0,image:a.image?.transformedUrl||"",productId:i.id,product_title:i.title,handle:i.handle,url:upsellProductUrlJs(i,d),selling_plan_allocation:null,optionsValuesEnriched:i.options?.map(p=>({name:p.name,value:p.optionValues?.map(u=>u.name)})),options_with_values:a.selectedOptions?.map(p=>({name:p.name,value:p.value}))||[],variant_id:d,subscriptionData:s,availableForSale:a.availableForSale,reviewRating:c,reviewCount:h}});this.svelteApp?.updateUpsellProducts&&this.svelteApp.updateUpsellProducts(r)}catch{return!1}}open(t=!1){!this.cart||t?this.loadCart().then(()=>{this.openDrawer()}).catch(e=>{console.error("Erreur lors du chargement du panier:",e),this.openDrawer()}):this.openDrawer()}openImmediate(){if(this.isOpen)return;const t=document.getElementById("moonbundle-cart-drawer");t&&(t.classList.add("open"),t.setAttribute("data-open","true"),this.isOpen=!0,document.body.style.overflow="hidden"),this._skeletonActive=!0,this.svelteApp?.setCartLoading&&this.svelteApp.setCartLoading(!0)}openDrawer(){const t=document.getElementById("moonbundle-cart-drawer");t&&(t.classList.add("open"),t.setAttribute("data-open","true"),this.isOpen=!0,document.body.style.overflow="hidden"),this.svelteApp?.verifyDiscounts&&this.svelteApp.verifyDiscounts(),setTimeout(()=>{this.analytics.sendView(this.cart?.token)},100)}close(){const t=document.getElementById("moonbundle-cart-drawer");if(t){t.classList.remove("open"),t.setAttribute("data-open","false"),this.isOpen=!1,document.body.style.overflow="",document.body.style.removeProperty("position"),document.body.style.removeProperty("top"),document.body.style.removeProperty("left"),document.body.style.removeProperty("width"),document.documentElement.classList.remove("no-scroll"),document.body.classList.remove("overflow-hidden"),document.body.classList.remove("sidebar-opened");const e=document.body;for(const n of e.querySelectorAll("[inert], [data-js-inert]"))n.removeAttribute("inert"),n.removeAttribute("data-js-inert");e.removeAttribute("inert"),e.removeAttribute("data-js-inert")}}toggle(){this.isOpen?this.close():this.open()}isOnCartPage(){const t=window.location.pathname;return t===this.cartUrl||t.endsWith(this.cartUrl)}proceedToCheckout(){this.cart&&this.cart.item_count>0&&(window.location.href=this.checkoutUrl)}applyCartDrawerStyles(){const t=this.cartDrawerProps?.stylesCart;t&&Object.entries(t).forEach(([e,n])=>{n&&n.trim()!==""&&this.style.setProperty(e,n)})}async connectedCallback(){if(!this._isRendered){this._isRendered=!0;try{await this.init(),await this.renderSvelteComponent(),this.applyCartDrawerStyles()}catch(t){console.error("Error initializing CartDrawer:",t)}}}renderSvelteComponent(){return new Promise((t,e)=>{(()=>{if(this.svelteApp){t();return}if(!window.MoonbundleCartDrawer||typeof window.MoonbundleCartDrawer!="function"){setTimeout(()=>this.renderSvelteComponent().then(t).catch(e),100);return}try{if(this.svelteApp=window.MoonbundleCartDrawer(this,{cart:this.cart,cartDrawerProps:this.cartDrawerProps||null,shopMoneyFormat:this.shopMoneyFormat||null,globalCustomCss:this.globalCustomCss||null,globalCustomJs:this.globalCustomJs||null,acceleratedCheckoutHtml:this.acceleratedCheckoutHtml||null,country:window.Shopify.country,onStateChanged:r=>{},onSvelteComponentReady:()=>{},onSubscriptionChange:r=>{this.handleSubscriptionChange(r)}}),this.svelteApp)this.loadCart().then(()=>{}).catch(r=>{}),t();else throw new Error("Invalid Svelte component instance")}catch{setTimeout(()=>this.renderSvelteComponent().then(t).catch(e),500)}})()})}handleVariantChange(t,e,n,r,i,a,l){let s=[],c=null;if(this.cart&&this.cart.items){const h=this.cart.items.findIndex(d=>d.key===t);if(h!==-1){const d=this.cart.items[h];c=d.options_with_values?[...d.options_with_values]:[],s=[...d.options_with_values||[]];const p=s.findIndex(u=>u.name===e);p!==-1?s[p]={name:e,value:n}:s.push({name:e,value:n}),d.options_with_values=s}}this.updateCartItemVariant(t,e,n,r,i,s,c,l)}async handleSubscriptionChange(t){const{itemKey:e,action:n,sellingPlanId:r,quantity:i}=t;try{if(this.enableLoading("changeSubscription",e),n==="enableSubscription"){let a=r;if(!a){const l=this.cart.items.find(s=>s.key===e);if(l&&l.subscriptionData&&l.subscriptionData.length>0){const s=l.subscriptionData[0];s.sellingPlans&&s.sellingPlans.length>0&&(a=s.sellingPlans[0].id)}}await this.updateCartItemSellingPlan(e,a,i)}else n==="disableSubscription"?await this.updateCartItemSellingPlan(e,null,i):n==="changeSubscription"&&await this.updateCartItemSellingPlan(e,r,i)}catch(a){console.error("Error handling subscription change:",a)}finally{this.disableLoading("changeSubscription",e)}}async updateCartItemSellingPlan(t,e,n){try{const r={id:t,quantity:n};e?r.selling_plan=e:r.selling_plan=null;const i=await fetch(this.cartUrl+"/change.js",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(i.ok)this.cart=await i.json(),this.triggerCartUpdate();else if(!await this.handleCartError(i,"Erreur lors de la mise \xE0 jour de l'abonnement"))throw new Error("Failed to update selling plan")}catch(r){console.error("Error updating selling plan:",r)}}async updateCartItemVariant(t,e,n,r,i,a,l,s){try{this.enableLoading("changeVariant",t);const c=`
        query getVariantBySelectedOptions(
            $productId: ID!
            $country: CountryCode
            $locale: LanguageCode
            $selectedOptions: [SelectedOptionInput!]!
          ) @inContext(country: $country, language: $locale) {
            node(id: $productId) {
              ... on Product {
                variantBySelectedOptions(selectedOptions: $selectedOptions) {
                  id
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    altText
                    transformedUrl: url(
                      transform: {
                        preferredContentType: WEBP
                        maxHeight: 200
                        maxWidth: 200
                      }
                    )
                  }
                }
              }
            }
          }
      `,h={productId:r,country:window.Shopify.country,locale:getShopifyStorefrontLanguageCode(),selectedOptions:a},d=await fetch("/api/2025-10/graphql.json",{method:"POST",headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":this.cartDrawerProps.storefrontToken},body:JSON.stringify({query:c,variables:h})});let p=null,u=!0;if(d.ok){const w=(await d.json()).data.node.variantBySelectedOptions;w&&(p=w.id,u=w.availableForSale)}else console.error("Failed to get variant by selected options:",d.status);if(!u){const v=this.cartDrawerProps?.globalTexts?.outOfStock||"Out of stock";if(this.cart&&this.cart.items&&l){const b=this.cart.items.findIndex(C=>C.key===t);b!==-1&&(this.cart.items[b].options_with_values=l)}const w=document.querySelector(`.moonbundle-select__select[data-item-key="${t}"][data-option-name="${e}"]`);w&&s&&(w.value=s),this.disableLoading("changeVariant",t);return}if(!this.cart.items.find(v=>v.key===t))return;const y=`
        mutation cartLinesUpdate($cartId: ID!, $linesToUpdate: [CartLineUpdateInput!]!, $country: CountryCode, $locale: LanguageCode)
        @inContext(country: $country, language: $locale)
         {
          cartLinesUpdate(cartId: $cartId, lines: $linesToUpdate) {
            cart {
              id
              createdAt
              updatedAt
              lines(first: 250) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        price {
                          amount
                          currencyCode
                        }
                        compareAtPrice {
                          amount
                          currencyCode
                        }
                        product {
                          id
                          title
                          handle
                          options {
                            name
                            optionValues {
                              name
                            }
                          }
                        }
                        selectedOptions {
                          name
                          value
                        }
                      }
                    }
                    cost {
                      subtotalAmount {
                        amount
                        currencyCode
                      }
                      totalAmount {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
              cost {
                subtotalAmount {
                  amount
                  currencyCode
                }
                totalAmount {
                  amount
                  currencyCode
                }
                totalTaxAmount {
                  amount
                  currencyCode
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `,m={cartId:`gid://shopify/Cart/${this.cart.token}`,linesToUpdate:[{id:i,merchandiseId:p}],country:window.Shopify.country,locale:getShopifyStorefrontLanguageCode()},f=await fetch("/api/2025-10/graphql.json",{method:"POST",headers:{"Content-Type":"application/json","X-Shopify-Storefront-Access-Token":this.cartDrawerProps.storefrontToken},body:JSON.stringify({query:y,variables:m})});if(f.ok){const v=await f.json();if(v.data?.cartLinesUpdate?.userErrors?.length>0)return;v.data?.cartLinesUpdate?.cart&&(this.triggerCartUpdate(),this.disableLoading("changeVariant",t))}else this.disableLoading("changeVariant",t)}catch{this.disableLoading("changeVariant",t)}}}customElements.define("moonbundle-cart-drawer-block",MoonBundleCartDrawer),window.MoonBundleCartDrawer=MoonBundleCartDrawer,window.openMoonBundleCartDrawer=function(){const o=document.querySelector("moonbundle-cart-drawer-block");o&&o.open()},window.closeMoonBundleCartDrawer=function(){const o=document.querySelector("moonbundle-cart-drawer-block");o&&o.close()},window.proceedToCheckout=function(){window.moonBundleCartDrawer&&window.moonBundleCartDrawer.proceedToCheckout()};function initializeCartDrawer(){if(!document.querySelector("moonbundle-cart-drawer-block")){const o=document.createElement("moonbundle-cart-drawer-block");document.body.appendChild(o)}setTimeout(()=>{const o=document.querySelector("moonbundle-cart-drawer-block");o&&o.isOnCartPage()&&o.open(!0)},100)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",initializeCartDrawer):initializeCartDrawer(),window.addEventListener("popstate",()=>{const o=document.querySelector("moonbundle-cart-drawer-block");o&&o.isOnCartPage()&&o.open(!0)});function addCartDrawerStylesToHeader(){const o="moonbundle-cart-drawer-custom-styles";if(document.getElementById(o))return;const t=`
      .mini-cart-content:not(moonbundle-cart-drawer) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .overlaycart:not(moonbundle-cart-drawer) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #drawer-cart:not(moonbundle-cart-drawer) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .mfp-cart-draw:not(moonbundle-cart-drawer) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #shopify-section-minicart:not(moonbundle-cart-drawer) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div[class='PageOverlay is-visible'] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div[class~='Drawer'][aria-hidden='false'] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    aside[id='slideout-ajax-cart'] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div[class*='shopping-cart'] div[class*='mini-cart'] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div[class~='js-cart-drawer-root'] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div[class~='js-modal-overlay'] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div[class~='js-slideout-overlay'] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div[class~='boost-pfs-minicart-active'] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div[class~='boost-pfs-minicart-wrapper'] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div[class='so-modal so-modal-e-and-g-upsell fade engraving-only in'] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div[class='so-modal-backdrop fade in'] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .overlay-backdrop.overlay-drawer {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    cart-drawer:not(moonbundle-cart-drawer) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    cart-notification:not(moonbundle-cart-drawer):not(:has(a#cart-icon-bubble)) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #CartDrawer:not(moonbundle-cart-drawer) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #cart-drawer:not(moonbundle-cart-drawer) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #cart-drawer-container:not(moonbundle-cart-drawer) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .overlay.fixed.top-0.right-0.bottom-0.left-0.js-overlay:not(
        moonbundle-cart-drawer
      ) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #site-cart-sidebar:not(moonbundle-cart-drawer) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div[data-quick-cart]:not(moonbundle-cart-drawer) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #pp-cart-drawer:not(moonbundle-cart-drawer) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #pp-cart-drawer-overlay:not(moonbundle-cart-drawer) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .cart-container > .cart_content {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #dropdown-cart {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div.theme-popup-overlay {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #t4s-mini_cart {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #offcanvas-cart {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div.offcanvas-backdrop {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    m-cart-drawer {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    a#cart-icon-bubble::after {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    cart-notification div.minicart__wrapper {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #shopify-section-cart-drawer {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #mini-cart {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    cart-drawer-component dialog.cart-drawer__dialog {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    cart-drawer-component[drawer-type='cart-drawer'] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div.minicart__button.minicart__button--shopping-bag label.overlay {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    div.minicart__button.minicart__button--shopping-bag div[data-cart-container] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #modals-rightDrawer {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #wizz4-cart-drawer,
    #wizz4-cart-drawer-background {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #ajaxifyModal,
    #ajaxifyCart-overlay {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    dm-cart-drawer {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    drawer-element:has(cart-element) div[data-view='cart-drawer'] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .rt-theme-popup[data-popup-type='cart-popup'] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    cart-notification-drawer {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    cart-modal {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    .js-drawer-closing .main-content::after, .js-drawer-open .main-content::after {
      content:unset !important;
    }

    .js-drawer-open{
      overflow:auto !important;
    }

  `,e=document.createElement("style");e.id=o,e.textContent=t,document.head.appendChild(e)}function addPaymentIconAssetsToHeader(o){try{const t=o?.paymentIconsCart;if(!t||t.isActive!==!0)return;const e="https://moonbundle-assets.fra1.cdn.digitaloceanspaces.com/cart-svg/",n=document.head||document.getElementsByTagName("head")[0];if(!n)return;const r=t.listPaymentIcons||{};Object.keys(r).forEach(i=>{if(!!!r[i])return;const l=`${e}${i}.svg`,s=`moonbundle-preload-icon-${i}`;if(document.getElementById(s))return;const c=document.createElement("link");c.id=s,c.rel="preload",c.as="image",c.href=l,c.crossOrigin="anonymous",n.appendChild(c)})}catch{}}
