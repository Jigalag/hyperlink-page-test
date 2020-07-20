<?php

/*
Plugin Name: Hyperlink Page Test
Version: 1.0
Author: Veprev Oleksii
Description: Test all internal links on web site
*/

if ( !defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

define('HPT_URL', plugins_url( '/', __FILE__ ));
define('HPT_PATH', plugin_dir_path( __FILE__ ));

require_once HPT_PATH.'admin/settings.php';

