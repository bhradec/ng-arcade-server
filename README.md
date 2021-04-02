# UPUTE ZA POKRETANJE I KORIŠTENJE APLIKACIJE

## Opis projekta

ngArcade je aplikacija koja je "library" nekoliko postojećih igara otvorenog koda 
napravljenih u JavaScriptu. Aplikacija pruža mogućnost pokretanja i preuzimanja 
svake dostupne igre. Isto tako sadržava prijavu i registraciju korisnika, ostavljanje 
komentara na igre te neke dodatne značajke kao što je praćenje koji igrači igraju koje
igre.

## Upute za pokretanje

1) Backup MySQL baze nalazi se u direktoriju ./database.
Unutar tog direktorija nalazi se datoteka ngarcade_database.sql koja sadrži
običan SQL kod za stvaranje baze podataka, svih potrebnih tablica i insert početnih
podataka. 

2) Potrebno je podesiti podatke za spajanje na bazu u datoteci config.js.

3) Kod za frontend se nalazi u direktoriju ./ng-arcade-front.
4) Server se pokreće s `npm start` (prije toga `npm install` po potrebi).
5) Kompajlirani frontend (rezultat naredbe `ng build`) se već nalazi u direktoriju ./public/front

U aplikaciji već postoje 2 korisnika:
1) Username: ivica, password: ivicapass koji je administrator.
2) Username: mirko80, password: mirkopass koji je običan korisnik.

Korisniku koji je administrator u glavnom izborniku pojavljuje se link "Administration"
koji otvara stranicu za administraciju na kojoj je moguće dodavati, uređivati i brisati
igre i autore igara.

Aplikacija već sadrži desetak igrivih igara i komentara na igre. Komentare korisnici 
mogu dodavati, uređivati ili brisati.

Klikom na ime autora ispod igre otvara se profil autora koji sadrži popis igara koje je
taj autor napravio.

Isto tako postoji i profil svakog korisnika na kojemu se nalaze podatci o korisniku i
popis igara koje je korisnik prethodno igrao.

## Stvaranje korisnika (MySQL)

Ako na operacijskom sustavu GNU/Linux postoji potreba za staranjem novog korisnika u 
MySQL bazi, kako bi se izbjegli problemi u autentifikaciji korisnika potrebno je 
izvrsiti sljedece naredbe:
```
CREATE USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```
U slučaju da korisnik već postoji:
```
CREATE USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```

Nakon stvaranja korisnika, izvršiti SQL skriptu iz `database` direktorija na stvorenom
korisniku.