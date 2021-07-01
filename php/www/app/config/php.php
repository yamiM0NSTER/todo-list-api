<?php

// @date_default_timezone_set('Europe/Warsaw');
@date_default_timezone_set('UTC');

@set_time_limit(3600);
@error_reporting(32767);

@ini_set('display_errors', TRUE);
@ini_set('html_errors', FALSE);

@ini_set('default_charset', 'UTF-8');

@ini_set('mbstring.internal_encoding', 'UTF-8');
@ini_set('mbstring.http_input', 'UTF-8');
@ini_set('mbstring.http_output', 'UTF-8');

@ini_set('iconv.internal_encoding', 'UTF-8');
@ini_set('iconv.input_encoding', 'UTF-8');
@ini_set('iconv.output_encoding', 'UTF-8');

// since PHP 5.6
@ini_set('php.internal_encoding', 'UTF-8');
@ini_set('php.input_encoding', 'UTF-8');
@ini_set('php.output_encoding', 'UTF-8');

// since PHP 7
@ini_set('default_charset', 'UTF-8');

if (extension_loaded('mbstring')) {
  @mb_internal_encoding('UTF-8');
  @mb_regex_encoding('UTF-8');
}

if (function_exists('iconv_set_encoding')) {
  @iconv_set_encoding('internal_encoding', 'UTF-8');
  @iconv_set_encoding('input_encoding', 'UTF-8');
  @iconv_set_encoding('output_encoding', 'UTF-8');
}
