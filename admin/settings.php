<?php
/**
 * Created by PhpStorm.
 * User: oveprev
 * Date: 2020-07-01
 * Time: 21:50
 */

function hyperlink_page_test() {
    require_once 'templates/hyperlink-page-test-admin-page.php';
}

function hyperlink_page_test_menu() {
    add_menu_page("Hyperlink Page Test", "Hyperlink Page Test", "hyperlink_page_test_options", "hyperlink_page_test", "hyperlink_page_test", "");
}
add_action("admin_menu", "hyperlink_page_test_menu");


$admin = get_role( 'administrator' );
if ( ! empty( $admin ) ) {
    $admin->add_cap( 'hyperlink_page_test_options' );
}
$editor = get_role( 'editor' );
if ( ! empty( $editor ) ) {
    $editor->add_cap( 'hyperlink_page_test_options' );
}
