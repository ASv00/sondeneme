
{ pkgs }: {
  deps = [
    pkgs.php81
    pkgs.php81Packages.composer
    pkgs.mysql80
    pkgs.nodejs-18_x
  ];
  
  env = {
    PHP_INI_SCAN_DIR = "${pkgs.php81}/etc/php.d";
    LD_LIBRARY_PATH = "${pkgs.mysql80}/lib/mysql:${pkgs.lib.makeLibraryPath [pkgs.mysql80]}";
  };
}
