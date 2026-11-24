# Run in PowerShell inside the local portfolio checkout.
# Review upstream code and interactive installation prompts before approving.
$ErrorActionPreference = 'Stop'
function Install-Step([string]$Name, [string[]]$CommandArgs) {
  Write-Host "Installing $Name"
  & npx.cmd @CommandArgs
  if ($LASTEXITCODE -ne 0) { throw "Installation failed: $Name" }
}
Install-Step 'Taste' @('skills','add','https://github.com/Leonxlnx/taste-skill','--skill','design-taste-frontend','--agent','codex')
Install-Step 'UI/UX Pro Max' @('ui-ux-pro-max-cli','init','--ai','codex')
Install-Step 'Motion agent skill' @('motion-ai')
Install-Step 'Awwwards' @('skills','add','https://github.com/SandroHub013/awwwards-skill','--agent','codex')
Install-Step 'Scroll Craft' @('skills','add','https://github.com/nateherkai/scroll-craft','--agent','codex')
Install-Step 'MengTo' @('skills','add','https://github.com/MengTo/Skills','--agent','codex')
Write-Host 'Restart Codex and check /skills. This script requires a local network and Node.js.'
