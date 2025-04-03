
# [Latest Deployment](https://vibedrop-backend.cc25.chasacademy.dev/)

# Arbetsflöde för Vibedrop

All kod ändras via Merge Requests (MR).
Direktpush eller force-push till main är förbjudet.

Endast MR kan ändra main, så håll koden ren.
Om du märker att .gitignore saknar något, meddela eller lägg till en ändring via en egen branch.

#### 1.a Klona BACKEND repot - ssh
```
git clone git@git.chasacademy.dev:chas-challenge-2025/vibedrop/backend.git
```
#### 1.b Klona BACKEND repot - https
```
git clone https://git.chasacademy.dev/chas-challenge-2025/vibedrop/backend.git
```

#### 2. Skapa en ny branch
Skapa en branch från main med ett beskrivande namn på din feature - OBS: Max 30 tecken långt.
Exempel:
```
git checkout -b ny-feature
```

#### 3. Utveckla och testa lokalt

Gör dina ändringar i din feature‑branch.
Kör lokala tester (t.ex. npm run dev) för att säkerställa att allt fungerar. ??

#### 4. Pusha din branch och skapa en Merge Request
```
git push -u origin ny-feature
```
Skapa en Merge Request i GitLab WebGUI från din branch mot main.
Välj om du vill att någon annan ska granska din kod innan den godkänns.
Markera MR:n som "Draft" tills din funktion är klar.
Välj alternativen SQUASH COMMITS och DELETE SOURCE BRANCH för att hålla historiken ren.

#### 5. CI/CD Pipeline och Review Environment

När MR:n skapas startas pipelinen automatiskt. Den gör följande:
Bygger din kod och skapar en Docker‑image.
Deployar en temporär review‑environment, t.ex. https://review-ny-feature.cc25.chasacademy.dev, där du kan se dina ändringar live.
I MR:n finns länk till testmiljön under Operate->Environments

#### 6. Granskning och Merge

Om allt fungerar, ändra MR:n från "Draft" till klar och mergea den till main.
Vid merge tas den temporära review‑miljön automatiskt ner, och production‑miljön deployas med den nya koden från din branch.

## 7. Git-kommandon

Din bästa vän!
```
git status
```
Visa alla branches, MR's och commits i CLI
```
git log --oneline --graph --decorate --all
```
Visa ändringsdetaljer
```
git log -p
```
Visa vem som ändrat varje rad i en fil
```
git blame <sökväg+filnamn>
exempel: git blame src/app/SignIn/page.tsx 
```


#### Använd Rebase kontinuerligt om du arbetar på en branch länge för att inte hamna för långt efter de andra som kör sina egna branches emot main.

Mer info om Rebase finns här:

[Atlassin Guide](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase)

[Youtube-genomgång](https://www.youtube.com/watch?v=f1wnYdLEpgI)
