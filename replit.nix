{ pkgs }: {
    deps = [
        pkgs.nodePackages.pnpm
        pkgs.esbuild
        pkgs.nodejs_20

        pkgs.nodePackages.typescript
        pkgs.nodePackages.typescript-language-server
    ];
}