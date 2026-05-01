       IDENTIFICATION DIVISION.
       PROGRAM-ID. VALIDATE-INPUT.
       AUTHOR. LEGACYCORE-ENGINE.
      *>==============================================================
      *> Payroll Input Validation
      *>==============================================================
       ENVIRONMENT DIVISION.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 HOURS-WORKED      PIC S9(3)V99 VALUE ZEROS.
       01 HOURLY-RATE       PIC S9(6)V99 VALUE ZEROS.
       01 EMP-TYPE          PIC X        VALUE SPACES.
       01 EMP-ID            PIC X(10)    VALUE SPACES.
       01 VALID-FLAG        PIC X        VALUE 'Y'.
       01 ERROR-CODE        PIC 99       VALUE 0.
       01 ERROR-MSG         PIC X(80)    VALUE SPACES.
       01 MAX-HOURS         PIC 9(3)V99  VALUE 168.00.
       01 MAX-RATE          PIC 9(6)V99  VALUE 10000.00.
       01 INPUT-LINE        PIC X(120)   VALUE SPACES.

       PROCEDURE DIVISION.
       MAIN-LOGIC.
           ACCEPT INPUT-LINE FROM COMMAND-LINE
           UNSTRING INPUT-LINE DELIMITED BY ','
               INTO HOURS-WORKED HOURLY-RATE EMP-TYPE EMP-ID
           END-UNSTRING

           MOVE 'Y' TO VALID-FLAG
           MOVE 0 TO ERROR-CODE
           MOVE SPACES TO ERROR-MSG

           PERFORM VALIDATE-HOURS
           IF VALID-FLAG = 'Y'
               PERFORM VALIDATE-RATE
           END-IF
           IF VALID-FLAG = 'Y'
               PERFORM VALIDATE-EMP-TYPE
           END-IF
           IF VALID-FLAG = 'Y'
               PERFORM VALIDATE-EMP-ID
           END-IF

           DISPLAY VALID-FLAG ',' ERROR-CODE ',' ERROR-MSG
           STOP RUN.

       VALIDATE-HOURS.
           IF HOURS-WORKED < ZEROS OR HOURS-WORKED > MAX-HOURS
               MOVE 'N' TO VALID-FLAG
               MOVE 1 TO ERROR-CODE
               MOVE 'Hours must be between 0 and 168' TO ERROR-MSG
           END-IF.

       VALIDATE-RATE.
           IF HOURLY-RATE <= ZEROS OR HOURLY-RATE > MAX-RATE
               MOVE 'N' TO VALID-FLAG
               MOVE 2 TO ERROR-CODE
               MOVE 'Hourly rate must be between 0.01 and 10000' TO ERROR-MSG
           END-IF.

       VALIDATE-EMP-TYPE.
           IF EMP-TYPE NOT = 'F'
               AND EMP-TYPE NOT = 'P'
               AND EMP-TYPE NOT = 'C'
               MOVE 'N' TO VALID-FLAG
               MOVE 3 TO ERROR-CODE
               MOVE 'Employment type must be F, P, or C' TO ERROR-MSG
           END-IF.

       VALIDATE-EMP-ID.
           IF EMP-ID(1:4) NOT = 'EMP-'
               MOVE 'N' TO VALID-FLAG
               MOVE 4 TO ERROR-CODE
               MOVE 'Employee ID must match EMP-XXX format' TO ERROR-MSG
           END-IF.
