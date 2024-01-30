# LoginLogsAggService
Projekt pre štatistické spracovanie denných prihlásení

# Ako projekt otestovať?
- je potrebné mať nainštalovaný node js, git a docker v systéme.

# 1. Naklonujte projekt do vášho adresára pomocou:
git clone https://github.com/petocjshtml/LoginLogsAggService.git

# 2. Vojdite do priečinku project-root
cd LoginLogsAggService\project-root

# 3. Spustíte projekt cez docker pomocou príkazu:
docker-compose up --build
# (je potrebné mať spustený docker pri tomto kroku)

-------------------------------------------------------------------------

Po úspešnom spustení tohto kroku súbor LoginService.js
generuje (prednastavených) 50 náhodných loginov v požadovanom formáte ako pole:
[
{ 'ts': 1614281031, 'ip': '87.244.221.47' },
{ 'ts': 1614281031, 'ip': '87.244.221.47' },
{ 'ts': 1614281031, 'ip': '87.244.221.47' },
{ 'ts': 1614281031, 'ip': '87.244.221.47' },
...atď.
]

a následne ho upraví pre štatistické zobrazenie vo formáte, ktorý my potrebujeme:
[
{ date: '2024-01-30', country: 'GB' },
{ date: '2024-01-30', country: 'GB' },
{ date: '2024-01-30', country: 'GB' },
{ date: '2024-01-30', country: 'GB' },
...atď.
]
...
V súbore Statistics.js bola vytvorená metóda getLoginsByDate(specificDate){...},
ktorej na vstupe je dátum a táto metóda umožňuje z databázy vybrať objekty prihlásenia
s aktualizovaným dátumom a pre tento dátum spraviť štatistický rozbor tak, že objekty upraví
na požadovanú rozborovú formu a roztriedi prihlásenia podľa početnosti pre každú krajinu 
a usporiada ich od najúspešnejšieho pre daný deň:

[
{ date: '2024-01-30', order: 3, country: 'CN', logins: 10},
{ date: '2024-01-30', order: 4, country: 'JP', logins: 9 },
{ date: '2024-01-30', order: 5, country: 'GB', logins: 8 },
{ date: '2024-01-30', order: 6, country: 'FR', logins: 6 },
{ date: '2024-01-30', order: 7, country: 'KR', logins: 5 },
{ date: '2024-01-30', order: 8, country: 'DE', logins: 5 },
...atď.
]

Takto usporiadané objekty si môžte pozrieť v html tabuľke na základnom endpointe http://localhost:3000/
-----------------------------------------------------------------------------------------------

Pridávanie loginov môžete otestovať pomocou vytvorených dummy metód v LoginService.js
V súbore LoginLogsAggService.js môžte odkomentovať tieto riadky:
# loginService.testSingleLogin(); 
# loginService.testMultipleLogins(2);
# testSingleLogin() - slúži na pridanie jedného random loginu
# testMultipleLogins(102) - slúži na pridanie random poľa loginov - veľkosť poľa udávate vstupným číslom do funkcie
# ak takto zmeníte a zkompilujete kód, malo by sa vám vložiť do databázy 102 random loginov + 1 random login

-----------------------------------------------------------------------------------------------
Tabuľku loginov môžete vyprázniť zavolaním metódy deleteAllLogins() v LoginLogsAggService.js

-----------------------------------------------------------------------------------------------

# Ďalšia metóda testovania - CURL:
môžte skúsiť, keď servis beží dať do príkazového riadka príkaz
pre jeden login:
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "{\"ts\": 1706633516, \"ip\": \"87.244.221.47\"}"
pre skupinu:
curl -X POST http://localhost:3000/logins -H "Content-Type: application/json" -d "[{\"ts\": 1706633516, \"ip\": \"87.244.221.47\"}, {\"ts\": 1706633516, \"ip\": \"192.168.1.1\"}]"
Pozor!!! , je potrebné zmeniť timestamp na aktuálny dátum -  ak nezmeníte timestamp na dnešný dátum,
záznamy sa síce pridajú do databázy, ale v tabuľke html sa nezobrazia, pretože tá zobrazuje iba štatisiky agregácie pre aktuálny deň !

-----------------------------------------------------------------------------------------------
# Testovanie servisu
- Zostrojte si a vyskúšajte platné príkazy CURL
- V prípade potrebu vymažte databázu loginov pomocou deleteAllLogins()
- Pošlite si post requesty s údajmi na overenie endpointov
- Pri platných CURL post requestoch by malo zobrazovať hlášky ako: 
	- "Do tabuľky login bol vložený 1 objekt.",
	- "Do tabuľky login bolo vložené pole objektov o veľkosti: 2"
- Refreshnite tabuľku agregačných dát
- Štatistiky by po každom refreshi mali zobrazovať aktuálne, pretože som systém automatických aktualizácii štatistík
  vyriešil ako select z aktuálnych login dát, ktoré ukladám do databázy.
------------------------------------------------------------------------------------------------------------
- v projekte sú metódy pomenované názvami - čo robia, pre potrebu osobitného testovania samostatných metód
------------------------------------------------------------------------------------------------------------
@ Peter Šoltýs
