"""
Management command to synchronize the official school and institution directory
for the SJIS Inter-School Tech Carnival 2026.
Supports both PostgreSQL (production) and SQLite (development).
"""
from django.core.management.base import BaseCommand
from apps.core.models import School

OFFICIAL_SCHOOLS = [
    # Host School
    ("St. Joseph International School", "SJIS", 1),

    # Key Partner School
    ("St. Joseph Higher Secondary School", "SJHSS", 2),

    # External Schools from Tech Fest 2026 Invitation List:
    # Mohammadpur
    ("SFX Greenherald International School", "Greenherald", 10),
    ("Summerfield International School", "Summerfield", 10),
    ("Premier School Dhaka (Mohammadpur Branch)", "PSD Mohammadpur", 10),
    ("Mohammadpur Residential School and College", "MRSC", 10),
    ("London Grace International School", "London Grace", 10),
    ("Academia", "Academia", 10),
    ("Mohammadpur Preparatory School and College", "MPSC", 10),
    ("Northern International School", "NIS", 10),
    ("YWCA Junior Girls High School", "YWCA", 10),

    # Lalmatia
    ("Mangrove School", "Mangrove", 10),

    # Dhanmondi
    ("Cardiff International School Dhaka", "CISD", 10),
    ("Maple Leaf International School", "MLIS", 10),
    ("Daffodil International School", "DIS", 10),
    ("Daffodil International College", "DIC", 10),
    ("Lighthouse International School", "LIS", 10),
    ("European Standard School", "ESS", 10),
    ("Excel Academy", "Excel", 10),
    ("Mastermind English Medium School", "Mastermind", 10),
    ("South Breeze School", "South Breeze", 10),
    ("Dhanmondi Tutorial", "DT", 10),
    ("Oxford International School", "OIS", 10),
    ("Sunbeams School (Dhanmondi)", "Sunbeams", 10),

    # Cantonment
    ("Bangladesh International School & College", "BISC", 10),
    ("BAF Shaheen English Medium College (SMEC)", "SMEC", 10),
    ("Adamjee Cantonment Public School", "ACPS", 10),

    # Gulshan
    ("Canadian Trillinium School", "CTS", 10),
    ("Sydney International School", "SIS", 10),
    ("Sir John Wilson School", "SJWS", 10),
    ("Guidance International School", "GIS", 10),
    ("Manarat Dhaka International School & College", "MDIC", 10),

    # Mirpur
    ("Premier School Dhaka (Mirpur Branch)", "PSD Mirpur", 10),
    ("HEED International School", "HEED", 10),
    ("Methodist English Medium School", "MEMS", 10),

    # Other Prominent Colleges & Schools
    ("Notre Dame College", "NDC", 10),
    ("Scholastica", "Scholastica", 10),
    ("Sunnydale School", "Sunnydale", 10),
    ("Dhaka Residential Model College", "DRMC", 10),
    ("Rajuk Uttara Model College", "RUMC", 10),
    ("Viqarunnisa Noon School & College", "VNSC", 10),
    ("Holy Cross College", "HCC", 10),
    ("Birshreshtha Noor Mohammad Public College", "BNMPC", 10),
    ("Dhaka City College", "DCC", 10),

    # Universities (Collegiate Tier - Group E)
    ("University of Dhaka", "DU", 90),
    ("Bangladesh University of Engineering and Technology", "BUET", 90),
    ("Islamic University of Technology", "IUT", 90),
    ("BRAC University", "BRACU", 90),
    ("North South University", "NSU", 90),
    ("Independent University Bangladesh", "IUB", 90),
    ("East West University", "EWU", 90),
    ("American International University - Bangladesh", "AIUB", 90),
    ("United International University", "UIU", 90),
    ("Northern University Bangladesh", "NUB", 90),
]


class Command(BaseCommand):
    help = "Synchronizes all official external schools and institutions into the database"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Synchronizing official schools..."))
        created_count = 0
        updated_count = 0

        for name, short_name, order in OFFICIAL_SCHOOLS:
            sch = School.objects.filter(name=name).first()
            if not sch and short_name:
                sch = School.objects.filter(short_name=short_name).first()

            if sch:
                sch.name = name
                sch.short_name = short_name
                sch.order = order
                sch.is_active = True
                sch.save()
                updated_count += 1
            else:
                School.objects.create(
                    name=name,
                    short_name=short_name,
                    order=order,
                    is_active=True,
                )
                created_count += 1

        total = School.objects.count()
        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully synced schools! Created: {created_count}, Updated: {updated_count}, Total active in DB: {total}"
            )
        )
