       IDENTIFICATION DIVISION.
       PROGRAM-ID. TAX-CALCULATOR.
       AUTHOR. LEGACYCORE-ENGINE.
      *>==============================================================
      *> Australian Individual Income Tax Calculator
      *> 2024-25 ATO Tax Brackets
      *>==============================================================
       ENVIRONMENT DIVISION.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 ANNUAL-GROSS      PIC 9(12)V99 VALUE ZEROS.
       01 PAY-PERIODS       PIC 99       VALUE 26.
       01 TAX-ANNUAL        PIC 9(12)V99 VALUE ZEROS.
       01 TAX-PERIOD        PIC 9(10)V99 VALUE ZEROS.
       01 MEDICARE-ANNUAL   PIC 9(10)V99 VALUE ZEROS.
       01 MEDICARE-PERIOD   PIC 9(8)V99  VALUE ZEROS.
       01 EFF-RATE          PIC 9(3)V9999 VALUE ZEROS.
       01 TAXABLE-INCOME    PIC 9(12)V99 VALUE ZEROS.
       01 BRACKET-1         PIC 9(12)V99 VALUE 18200.00.
       01 BRACKET-2         PIC 9(12)V99 VALUE 45000.00.
       01 BRACKET-3         PIC 9(12)V99 VALUE 120000.00.
       01 BRACKET-4         PIC 9(12)V99 VALUE 180000.00.
       01 BASE-BRACKET-3    PIC 9(10)V99 VALUE 5092.00.
       01 BASE-BRACKET-4    PIC 9(10)V99 VALUE 29467.00.
       01 BASE-BRACKET-5    PIC 9(10)V99 VALUE 51667.00.
       01 MEDICARE-RATE     PIC V99      VALUE .02.
       01 MEDICARE-THRESH   PIC 9(6)V99  VALUE 26000.00.
       01 INPUT-LINE        PIC X(50)    VALUE SPACES.
       01 WS-TEMP           PIC 9(12)V99 VALUE ZEROS.

       PROCEDURE DIVISION.
       MAIN-LOGIC.
           ACCEPT INPUT-LINE FROM COMMAND-LINE
           UNSTRING INPUT-LINE DELIMITED BY ','
               INTO ANNUAL-GROSS PAY-PERIODS
           END-UNSTRING

           MOVE ANNUAL-GROSS TO TAXABLE-INCOME
           PERFORM CALCULATE-TAX
           PERFORM CALCULATE-MEDICARE

           COMPUTE TAX-PERIOD ROUNDED = TAX-ANNUAL / PAY-PERIODS
           COMPUTE MEDICARE-PERIOD ROUNDED = MEDICARE-ANNUAL / PAY-PERIODS

           IF ANNUAL-GROSS > ZEROS
               COMPUTE EFF-RATE ROUNDED =
                   (TAX-ANNUAL / ANNUAL-GROSS) * 100
           ELSE
               MOVE ZEROS TO EFF-RATE
           END-IF

           DISPLAY TAX-ANNUAL ','
               TAX-PERIOD ','
               MEDICARE-ANNUAL ','
               MEDICARE-PERIOD ','
               EFF-RATE
           STOP RUN.

       CALCULATE-TAX.
           EVALUATE TRUE
               WHEN TAXABLE-INCOME <= BRACKET-1
                   MOVE ZEROS TO TAX-ANNUAL
               WHEN TAXABLE-INCOME <= BRACKET-2
                   COMPUTE TAX-ANNUAL ROUNDED =
                       (TAXABLE-INCOME - BRACKET-1) * 0.19
               WHEN TAXABLE-INCOME <= BRACKET-3
                   COMPUTE WS-TEMP = TAXABLE-INCOME - BRACKET-2
                   COMPUTE TAX-ANNUAL ROUNDED =
                       BASE-BRACKET-3 + (WS-TEMP * 0.325)
               WHEN TAXABLE-INCOME <= BRACKET-4
                   COMPUTE WS-TEMP = TAXABLE-INCOME - BRACKET-3
                   COMPUTE TAX-ANNUAL ROUNDED =
                       BASE-BRACKET-4 + (WS-TEMP * 0.37)
               WHEN OTHER
                   COMPUTE WS-TEMP = TAXABLE-INCOME - BRACKET-4
                   COMPUTE TAX-ANNUAL ROUNDED =
                       BASE-BRACKET-5 + (WS-TEMP * 0.45)
           END-EVALUATE.

       CALCULATE-MEDICARE.
           IF ANNUAL-GROSS > MEDICARE-THRESH
               COMPUTE MEDICARE-ANNUAL ROUNDED =
                   ANNUAL-GROSS * MEDICARE-RATE
           ELSE
               MOVE ZEROS TO MEDICARE-ANNUAL
           END-IF.
