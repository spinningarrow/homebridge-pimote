let pkgs = import <nixpkgs> {};

in pkgs.stdenv.mkDerivation rec {
  name = "homebridge-pimote";

  buildInputs = with pkgs; [
    nodejs-9_x
  ];
}
