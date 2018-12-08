<?php

/**
 * Load services definition file.
 */
$settings['container_yamls'][] = __DIR__ . '/services.yml';

/**
 * Include the Pantheon-specific settings file.
 *
 * n.b. The settings.pantheon.php file makes some changes
 *      that affect all envrionments that this site
 *      exists in.  Always include this file, even in
 *      a local development environment, to ensure that
 *      the site settings remain consistent.
 */
include __DIR__ . "/settings.pantheon.php";

/**
 * Place the config directory outside of the Drupal root.
 */
$config_directories = array(
  CONFIG_SYNC_DIRECTORY => dirname(DRUPAL_ROOT) . '/config/default',
);

/**
 * Setup environments settings.
 */
if (isset($_SERVER['PANTHEON_ENVIRONMENT']) && php_sapi_name() != 'cli') {
  // Pantheon Dev settings
  if ($_SERVER['PANTHEON_ENVIRONMENT'] === 'dev') {
    $config['config_split.config_split.dev']['status'] = TRUE;
  }
  // Pantheon Test settings
  elseif ($_SERVER['PANTHEON_ENVIRONMENT'] === 'test') {
    $config['config_split.config_split.test']['status'] = TRUE;
  }
  // Pantheon Live settings
  elseif ($_ENV['PANTHEON_ENVIRONMENT'] === 'live') {
    //$config['config_split.config_split.prod']['status'] = TRUE;
  }
  // Pantheon Other? settings
  else {
  }
}
else {
  /**
   * If there is a local settings file, then include it
   */
  $local_settings = __DIR__ . "/settings.local.php";
  if (file_exists($local_settings)) {
    $config['config_split.config_split.local']['status'] = TRUE;
    include $local_settings;
  }
}

/**
 * Always install the 'standard' profile to stop the installer from
 * modifying settings.php.
 */
$settings['install_profile'] = 'lightning';
