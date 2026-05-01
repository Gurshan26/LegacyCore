       IDENTIFICATION DIVISION.
       PROGRAM-ID. OVERTIME-CALC.
       AUTHOR. LEGACYCORE-ENGINE.
      *>==============================================================
      *> Overtime Calculator
      *>==============================================================
       ENVIRONMENT DIVISION.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 TOTAL-HOURS       PIC 9(3)V99  VALUE ZEROS.
       01 HOURLY-RATE       PIC 9(6)V99  VALUE ZEROS.
       01 EMP-TYPE          PIC X        VALUE 'F'.
       01 STANDARD-HOURS    PIC 9(3)V99  VALUE 38.00.
       01 OVERTIME-HOURS    PIC 9(3)V99  VALUE ZEROS.
       01 OT-BAND-1-HOURS   PIC 9(3)V99  VALUE ZEROS.
       01 OT-BAND-2-HOURS   PIC 9(3)V99  VALUE ZEROS.
       01 BASE-PAY          PIC 9(10)V99 VALUE ZEROS.
       01 OT-PAY-BAND-1     PIC 9(10)V99 VALUE ZEROS.
       01 OT-PAY-BAND-2     PIC 9(10)V99 VALUE ZEROS.
       01 OVERTIME-PAY      PIC 9(10)V99 VALUE ZEROS.
       01 TOTAL-PAY         PIC 9(10)V99 VALUE ZEROS.
       01 INPUT-LINE        PIC X(80)    VALUE SPACES.

       PROCEDURE DIVISION.
       MAIN-LOGIC.
           ACCEPT INPUT-LINE FROM COMMAND-LINE
           UNSTRING INPUT-LINE DELIMITED BY ','
               INTO TOTAL-HOURS HOURLY-RATE EMP-TYPE
           END-UNSTRING

           EVALUATE EMP-TYPE
               WHEN 'F' MOVE 38.00 TO STANDARD-HOURS
               WHEN 'P' MOVE 30.00 TO STANDARD-HOURS
               WHEN 'C' MOVE 0.00  TO STANDARD-HOURS
               WHEN OTHER MOVE 38.00 TO STANDARD-HOURS
           END-EVALUATE

           IF EMP-TYPE = 'C'
               COMPUTE BASE-PAY ROUNDED = TOTAL-HOURS * HOURLY-RATE
               MOVE ZEROS TO OVERTIME-PAY
               MOVE ZEROS TO OVERTIME-HOURS
           ELSE
               IF TOTAL-HOURS <= STANDARD-HOURS
                   COMPUTE BASE-PAY ROUNDED = TOTAL-HOURS * HOURLY-RATE
                   MOVE ZEROS TO OVERTIME-PAY
                   MOVE ZEROS TO OVERTIME-HOURS
               ELSE
                   COMPUTE BASE-PAY ROUNDED = STANDARD-HOURS * HOURLY-RATE
                   COMPUTE OVERTIME-HOURS = TOTAL-HOURS - STANDARD-HOURS
                   IF OVERTIME-HOURS <= 3.00
                       MOVE OVERTIME-HOURS TO OT-BAND-1-HOURS
                       MOVE ZEROS TO OT-BAND-2-HOURS
                   ELSE
                       MOVE 3.00 TO OT-BAND-1-HOURS
                       COMPUTE OT-BAND-2-HOURS = OVERTIME-HOURS - 3.00
                   END-IF
                   COMPUTE OT-PAY-BAND-1 ROUNDED =
                       OT-BAND-1-HOURS * HOURLY-RATE * 1.5
                   COMPUTE OT-PAY-BAND-2 ROUNDED =
                       OT-BAND-2-HOURS * HOURLY-RATE * 2.0
                   COMPUTE OVERTIME-PAY = OT-PAY-BAND-1 + OT-PAY-BAND-2
               END-IF
           END-IF

           COMPUTE TOTAL-PAY = BASE-PAY + OVERTIME-PAY

           DISPLAY BASE-PAY ','
               OVERTIME-PAY ','
               OVERTIME-HOURS ','
               TOTAL-PAY
           STOP RUN.
