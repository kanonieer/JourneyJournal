# JourneyJournal
Grupowy Projekt Inżynierski 

Idea:
Aplikacja mobilna "Journey Journal" zbiera informację (zdjęcia, trasę, przebieg) o przebytej przez użytkownika podróży. Przesyła informację na serwer. Dane o podróży pakuje w bazie danych, zdjęcia przechowuje na dysku cloudowym uzytkownika. Strona webowa pozwala na przegladanie podróży, dzielenie się linkami do galerii, udostepnianie zdjęć.

Warstwy:
1. Mobile - Ionic 2 + Angular 2 (iOS, Android)
2. Web - Angular 2 (Chrome, Mozilla, Safari, Opera)
3. Server - Node.js + Express
4. Hosting - Google Drive / Dropbox / Apple Cloud
5. Baza danych - Postrges / Mongo

Widoki:
1. Mobile:
    - niezalogowany:
        - logowanie przez facebook / email
    - zalogowany:    
        - new journey:
            - tworzenie nowej podróży
            - ustalenie daty rozpoczęcia i zakończenia
            - ustalenie docelowego dysku cloudowego (?)
        - undergoing journeys:
            - wyświetlenie listy trwającej / zaplanowanych podróży
        - archival journeys:
            - lista odbytych podróży
        - profile 
            - zarządzanie kontem
            - dodawanie / zmiania dysku cloudowego

2. Web:
    - niezarejestrowany:
        - rejestracja przez facebook / email
    - niezalogowany:
        - logowanie przez facebook / email
    - zalogowany:
        - journeys:
            - lista wszystkich podróży usera
            - journey:
                - tytuł
                - okres trwania, przebyte kilometry
                - czas trwania, liczba zdjęć
                - mapa
                - generowanie linku do galerii
                - możliwość wydruku (?)
                - zdjęcia:
                    - powiekszenie (slider?)
                    - udostępnienie (facebook)
        - summary:
            - wyświetla podsumowanie wszystkich podróży usera
            - łączne przebyte kilometry
            - łączną liczbę zrobionych zdjęć
            - liczbę przebytych podróży
            - liczbę dni w podróży
            - itp
        - profile:
            - pozwala na zarządzanie kontem
            - pozwala na usunięcie konta
            - pozwala na dodanie dysku cloudowego
            - pozwala na zmianę dysku cloudowego
        - about:
            - krótkie info odnośnie projektu

Budowa obiektów/klas:
1. Zdjęcie (plik) 

2. Etap
    - data rozpoczęcia
    - data zakończenia
    - nazwa

3. Zdjęcie (obiekt):
    - plik (1)
    - data utworzenia
    - miejsce (lon, lat)
    - etap (2)

4. Podróż:
    - data rozpoczęcia
    - data zakończenia
    - trasa
    - etapy (2) []
    - zdjęcia (3) []
    
5. User:
    - email + hasło / facebook
    - podróże (4) []
    - dysk []
