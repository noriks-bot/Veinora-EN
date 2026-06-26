<?php
/**
 * Venovia Zip theme header
 * Announcement bar + sticky header (logo center + cart)
 *
 * @package venoviazip
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

<?php wp_head(); ?>
</head>

<body <?php body_class( 'venoviazip-body' ); ?>>

<?php wp_body_open(); ?>

<div id="page" class="venoviazip-site">

  <?php /* boris-hide-hf */ if ( ! ( ( function_exists( 'is_cart' ) && is_cart() ) || ( function_exists( 'is_checkout' ) && is_checkout() ) ) ) : ?>
  <!-- Announcement bar (marquee) -->
<div
  class="marquee color-scheme-682a99a2-3268-43c2-a338-22f792d019c9 "
  style="
    --margin-top: 0px;
    --margin-bottom: 0px;
  "
  
>
  <marquee-component
    style="
      --marquee-direction: normal;
      --marquee-gap: 79px;
      --padding-top: 10px;
      --padding-bottom: 10px;
    "
    data-speed-factor="20"
    data-movement-direction="normal"
  >
    <div
      class="marquee__wrapper"
      data-ref="wrapper"
    >
      <div
        class="marquee__content"
        data-ref="content"
      >
        <div class="marquee__repeated-items">
          




  <div
    class="
      text-block paragraph text-block-left-desktop text-block-left-mobile"
    style="
      --text-align: left;
      --text-align-mobile: left;
      --margin-top: 0px;
      --margin-bottom: 0px;
      --font-weight: 300;
      
        --font-size: var(--font-body--size-emphasized);
      
      
    "
    
    
  >
    
      <p><strong>FREE SHIPPING </strong></p>
    
  </div>










  <div
    class="
      text-block paragraph text-block-center-desktop text-block-left-mobile"
    style="
      --text-align: center;
      --text-align-mobile: left;
      --margin-top: 0px;
      --margin-bottom: 0px;
      --font-weight: 300;
      
        --font-size: var(--font-body--size-emphasized);
      
      
    "
    
    
  >
    
      <p><strong>LIMITED OFFER</strong></p>
    
  </div>










  <div
    class="
      text-block paragraph text-block-center-desktop text-block-left-mobile"
    style="
      --text-align: center;
      --text-align-mobile: left;
      --margin-top: 0px;
      --margin-bottom: 0px;
      --font-weight: 300;
      
        --font-size: var(--font-body--size-emphasized);
      
      
    "
    
    
  >
    
      <p><strong>60-DAY MONEY-BACK GUARANTEE</strong></p>
    
  </div>






        <div class="marquee__repeated-items">
          




  <div
    class="
      text-block paragraph text-block-left-desktop text-block-left-mobile"
    style="
      --text-align: left;
      --text-align-mobile: left;
      --margin-top: 0px;
      --margin-bottom: 0px;
      --font-weight: 300;
      
        --font-size: var(--font-body--size-emphasized);
      
      
    "
    
    
  >
    
      <p><strong>FREE SHIPPING </strong></p>
    
  </div>










  <div
    class="
      text-block paragraph text-block-center-desktop text-block-left-mobile"
    style="
      --text-align: center;
      --text-align-mobile: left;
      --margin-top: 0px;
      --margin-bottom: 0px;
      --font-weight: 300;
      
        --font-size: var(--font-body--size-emphasized);
      
      
    "
    
    
  >
    
      <p><strong>LIMITED OFFER</strong></p>
    
  </div>










  <div
    class="
      text-block paragraph text-block-center-desktop text-block-left-mobile"
    style="
      --text-align: center;
      --text-align-mobile: left;
      --margin-top: 0px;
      --margin-bottom: 0px;
      --font-weight: 300;
      
        --font-size: var(--font-body--size-emphasized);
      
      
    "
    
    
  >
    
      <p><strong>60-DAY MONEY-BACK GUARANTEE</strong></p>
    
  </div>






        </div>
      </div>
    </div>
  </marquee-component>
</div>

  <!-- Main header -->
  <header class="cal-header" role="banner">
    <div class="cal-header-inner">

      <div class="cal-header-left">
        <button class="cal-menu-btn" aria-label="Menu" onclick="document.body.classList.toggle('cal-menu-open')">
          <span></span><span></span><span></span>
        </button>
        <nav class="cal-nav-desktop" aria-label="Main menu">
          <a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
          <a href="<?php echo esc_url( home_url( '/shop/' ) ); ?>">Shop</a>
          <a href="<?php echo esc_url( home_url( '/product/compression-stockings-with-a-zip/' ) ); ?>">Venovia Zip</a>
        </nav>
      </div>

      <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="cal-logo" aria-label="Venovia Zip">
        <span class="cal-logo-text">VENOVIA ZIP</span>
      </a>

      <div class="cal-header-right">
        <a href="<?php echo function_exists('wc_get_cart_url') ? esc_url( wc_get_cart_url() ) : '/cart'; ?>" class="cal-icon-btn cal-cart-btn" aria-label="Cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h9.6a2 2 0 0 0 2-1.6L23 6H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
          <span class="cal-cart-count"><?php echo function_exists('WC') && WC()->cart ? WC()->cart->get_cart_contents_count() : 0; ?></span>
        </a>
      </div>

    </div>

    <div class="cal-mobile-drawer">
      <nav class="cal-nav-mobile" aria-label="Mobile menu">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
        <a href="<?php echo esc_url( home_url( '/shop/' ) ); ?>">Shop</a>
        <a href="<?php echo esc_url( home_url( '/product/compression-stockings-with-a-zip/' ) ); ?>">Venovia Zip</a>
        <a href="<?php echo esc_url( site_url( '/my-account/' ) ); ?>">My account</a>
      </nav>
    </div>
  </header>
  <?php endif; ?>

  <div id="content" class="cal-site-content">
