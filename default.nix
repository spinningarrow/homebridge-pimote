let pkgs = import <nixpkgs> {};

in pkgs.stdenv.mkDerivation rec {
  name = "nimble";

  buildInputs = with pkgs; [
    nodejs-9_x
  ];
}
