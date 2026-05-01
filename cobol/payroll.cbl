       IDENTIFICATION DIVISION.
       PROGRAM-ID. PAYROLL-MASTER.
       AUTHOR. LEGACYCORE-ENGINE.
      *>==============================================================
      *> Master Payroll Processing Program
      *>==============================================================
       ENVIRONMENT DIVISION.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 EMP-ID            PIC X(10)    VALUE SPACES.
       01 HOURS-WORKED      PIC 9(3)V99  VALUE ZEROS.
       01 HOURLY-RATE       PIC 9(6)V99  VALUE ZEROS.
       01 EMP-TYPE          PIC X        VALUE 'F'.
       01 AL-BALANCE        PIC 9(6)V99  VALUE ZEROS.
       01 SL-BALANCE        PIC 9(6)V99  VALUE ZEROS.
       01 YTD-GROSS         PIC 9(10)V99 VALUE ZEROS.
       01 GROSS-PAY         PIC 9(10)V99 VALUE ZEROS.
       01 TAX-WITHHELD      PIC 9(8)V99  VALUE ZEROS.
       01 MEDICARE-LEVY     PIC 9(6)V99  VALUE ZEROS.
       01 SUPER-AMOUNT      PIC 9(8)V99  VALUE ZEROS.
       01 NET-PAY           PIC 9(10)V99 VALUE ZEROS.
       01 ANNUAL-GROSS      PIC 9(12)V99 VALUE ZEROS.
       01 NEW-YTD-GROSS     PIC 9(10)V99 VALUE ZEROS.
       01 SUPER-RATE        PIC V999     VALUE .115.
       01 PAY-PERIODS       PIC 99       VALUE 26.
       01 INPUT-LINE        PIC X(120)   VALUE SPACES.

       PROCEDURE DIVISION.
       MAIN-LOGIC.
           ACCEPT INPUT-LINE FROM COMMAND-LINE
           UNSTRING INPUT-LINE DELIMITED BY ','
               INTO EMP-ID HOURS-WORKED HOURLY-RATE EMP-TYPE
                    AL-BALANCE SL-BALANCE YTD-GROSS
           END-UNSTRING

           PERFORM CALCULATE-GROSS-PAY
           PERFORM CALCULATE-TAX
           PERFORM CALCULATE-SUPER
           PERFORM CALCULATE-NET
           PERFORM UPDATE-YTD
           PERFORM OUTPUT-RECORD
           STOP RUN.

       CALCULATE-GROSS-PAY.
           COMPUTE GROSS-PAY ROUNDED = HOURS-WORKED * HOURLY-RATE.

       CALCULATE-TAX.
           COMPUTE ANNUAL-GROSS ROUNDED = GROSS-PAY * PAY-PERIODS
           PERFORM APPLY-TAX-BRACKETS
           COMPUTE TAX-WITHHELD ROUNDED = TAX-WITHHELD / PAY-PERIODS
           IF ANNUAL-GROSS > 26000
               COMPUTE MEDICARE-LEVY ROUNDED =
                   (ANNUAL-GROSS * .02) / PAY-PERIODS
           ELSE
               MOVE ZEROS TO MEDICARE-LEVY
           END-IF.

       APPLY-TAX-BRACKETS.
           EVALUATE TRUE
               WHEN ANNUAL-GROSS <= 18200
                   MOVE ZEROS TO TAX-WITHHELD
               WHEN ANNUAL-GROSS <= 45000
                   COMPUTE TAX-WITHHELD ROUNDED =
                       (ANNUAL-GROSS - 18200) * 0.19
               WHEN ANNUAL-GROSS <= 120000
                   COMPUTE TAX-WITHHELD ROUNDED =
                       5092 + ((ANNUAL-GROSS - 45000) * 0.325)
               WHEN ANNUAL-GROSS <= 180000
                   COMPUTE TAX-WITHHELD ROUNDED =
                       29467 + ((ANNUAL-GROSS - 120000) * 0.37)
               WHEN OTHER
                   COMPUTE TAX-WITHHELD ROUNDED =
                       51667 + ((ANNUAL-GROSS - 180000) * 0.45)
           END-EVALUATE.

       CALCULATE-SUPER.
           COMPUTE SUPER-AMOUNT ROUNDED = GROSS-PAY * SUPER-RATE.

       CALCULATE-NET.
           COMPUTE NET-PAY ROUNDED =
               GROSS-PAY - TAX-WITHHELD - MEDICARE-LEVY.

       UPDATE-YTD.
           COMPUTE NEW-YTD-GROSS = YTD-GROSS + GROSS-PAY.

       OUTPUT-RECORD.
           DISPLAY EMP-ID ','
               GROSS-PAY ','
               TAX-WITHHELD ','
               MEDICARE-LEVY ','
               SUPER-AMOUNT ','
               NET-PAY ','
               NEW-YTD-GROSS.
