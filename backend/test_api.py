import os
import sys
import unittest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestGap2GrowAPI(unittest.TestCase):
    def test_health(self):
        res = client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "ok")

    def test_auth_demo_users(self):
        res = client.get("/api/auth/demo-users")
        self.assertEqual(res.status_code, 200)
        users = res.json()
        self.assertGreaterEqual(len(users), 4)
        roles = {u["role"] for u in users}
        self.assertIn("STUDENT", roles)
        self.assertIn("FACULTY", roles)
        self.assertIn("REMEDIAL_COORDINATOR", roles)
        self.assertIn("LIBRARY", roles)

    def test_student_login(self):
        res = client.post("/api/auth/login", json={
            "role": "STUDENT",
            "identifier": "23CSE101",
            "password": "password123"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["user"]["name"], "Rahul Kumar")

    def test_student_exam_submit_and_ai_eval(self):
        # Fetch exams
        res = client.get("/api/student/exams")
        self.assertEqual(res.status_code, 200)
        exams = res.json()
        self.assertGreaterEqual(len(exams), 1)
        exam_id = exams[0]["id"]

        # Submit answers
        sub_res = client.post(f"/api/student/exams/{exam_id}/submit", json={
            "studentName": "Rahul Kumar",
            "studentIdentifier": "23CSE101",
            "timeTaken": "18m 45s",
            "answers": {
                "1": "B",
                "2": "C",
                "3": "True",
                "4": "The recursive call stack stores activation records with node addresses and local frames to return to parent nodes upon base case completion.",
                "5": "B",
                "6": "B",
                "7": "Postorder traverses subtrees first and frees children prior to parent node deallocation, avoiding dangling pointers.",
                "8": "True"
            }
        })
        self.assertEqual(sub_res.status_code, 200)
        result = sub_res.json()
        self.assertGreaterEqual(result["score"], 14)
        self.assertTrue(result["passed"])
        self.assertIn("evaluation", result)

    def test_library_issue_and_return(self):
        books_res = client.get("/api/library/books")
        self.assertEqual(books_res.status_code, 200)
        books = books_res.json()
        self.assertGreaterEqual(len(books), 1)
        book = books[0]
        initial_avail = book["availableCopies"]

        # Issue copy
        if initial_avail > 0:
            issue_res = client.post(f"/api/library/books/{book['id']}/issue")
            self.assertEqual(issue_res.status_code, 200)
            self.assertEqual(issue_res.json()["availableCopies"], initial_avail - 1)

            # Return copy
            return_res = client.post(f"/api/library/books/{book['id']}/return")
            self.assertEqual(return_res.status_code, 200)
            self.assertEqual(return_res.json()["availableCopies"], initial_avail)

    def test_remedial_endpoints(self):
        stats_res = client.get("/api/remedial/dashboard-stats")
        self.assertEqual(stats_res.status_code, 200)
        self.assertIn("totalStudents", stats_res.json())

        students_res = client.get("/api/remedial/students")
        self.assertEqual(students_res.status_code, 200)
        self.assertGreaterEqual(len(students_res.json()), 1)

    def test_ai_chat(self):
        res = client.post("/api/ai/chat", json={
            "message": "What is a binary tree?",
            "userContext": {"name": "Rahul Kumar", "department": "CSE"}
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("reply", res.json())
        self.assertIn("binary tree", res.json()["reply"].lower())

    def test_ai_simplify_topic(self):
        res = client.post("/api/ai/simplify", json={
            "type": "topic",
            "content": "Binary Tree Inorder Traversal",
            "topic": "Binary Trees"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("simpleExplanation", data)
        self.assertIn("keyConcepts", data)
        self.assertIn("examNotes", data)
        self.assertIn("quickRevision", data)
        self.assertIn("practiceQuestions", data)

    def test_topic_hierarchy(self):
        res = client.get("/api/student/topic-hierarchy?topic_id=trees")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["topicId"], "trees")
        self.assertIn("hierarchy", data)
        self.assertGreaterEqual(len(data["hierarchy"]), 2)

    def test_important_notes(self):
        res = client.get("/api/student/important-notes?department=CSE&year=2")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 5)

    def test_super_admin_login(self):
        res = client.post("/api/auth/login", json={
            "role": "SUPER_ADMIN",
            "identifier": "superadmin",
            "password": "SuperAdmin@123"
        })
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["user"]["role"], "SUPER_ADMIN")

    def test_public_signup_blocked_for_non_students(self):
        for blocked_role in ["SUPER_ADMIN", "FACULTY", "REMEDIAL_COORDINATOR", "LIBRARY"]:
            res = client.post("/api/auth/register", json={
                "name": f"Unauthorized {blocked_role}",
                "role": blocked_role,
                "identifier": f"UNAUTH_{blocked_role}",
                "email": f"unauth_{blocked_role.lower()}@vignan.ac.in",
                "password": "password123"
            })
            self.assertEqual(res.status_code, 403)

    def test_preadded_faculty_logins(self):
        faculty_credentials = [
            ("sai.eswari", "Faculty@123", "Database Management System"),
            ("prathap.kumar", "Faculty@123", "Data Structures"),
            ("santhosh", "Faculty@123", "Discrete Mathematics"),
            ("latesh.babu", "Faculty@123", "Object Oriented Programming Through Java"),
            ("sumalatha", "Faculty@123", "Digital Logic Design"),
            ("sunilbabu", "Faculty@123", "Artificial Intelligence"),
            ("anil", "Faculty@123", "Data Wrangling And Visualisation")
        ]
        for ident, pw, expected_sub in faculty_credentials:
            res = client.post("/api/auth/login", json={
                "role": "FACULTY",
                "identifier": ident,
                "password": pw
            })
            self.assertEqual(res.status_code, 200, f"Failed login for {ident}")
            user = res.json()["user"]
            self.assertEqual(user["role"], "FACULTY")
            self.assertEqual(user.get("assignedSubject"), expected_sub)

    def test_preadded_coordinators_and_library_logins(self):
        # Coordinators
        for ident in ["bhargavi", "shareefa", "phani.kumar"]:
            res = client.post("/api/auth/login", json={
                "role": "REMEDIAL_COORDINATOR",
                "identifier": ident,
                "password": "Remedial@123"
            })
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.json()["user"]["role"], "REMEDIAL_COORDINATOR")

        # Library
        res = client.post("/api/auth/login", json={
            "role": "LIBRARY",
            "identifier": "library",
            "password": "Library@123"
        })
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["user"]["role"], "LIBRARY")

    def test_remedial_student_filtering_and_suggestions(self):
        # 1. Fetch remedial students (< 40%)
        res = client.get("/api/remedial/students")
        self.assertEqual(res.status_code, 200)
        remedial_students = res.json()
        for s in remedial_students:
            self.assertLess(s["progress"], 40.0)

        # 2. Send suggestion to student 23CSE001
        sugg_res = client.post("/api/remedial/suggestions", json={
            "studentIdentifier": "23CSE001",
            "studentName": "Rahul Kumar",
            "subject": "Database Management System",
            "suggestionText": "Please revise Unit 1 and Unit 2 and complete practice questions.",
            "sentByName": "Remedial Coordinator"
        })
        self.assertEqual(sugg_res.status_code, 200)

        # 3. Check student notifications
        notif_res = client.get("/api/student/notifications?student_identifier=23CSE001")
        self.assertEqual(notif_res.status_code, 200)
        notifs = notif_res.json()
        self.assertGreaterEqual(len(notifs), 1)

    def test_remedial_exam_eligibility_rules(self):
        # 1. Create a remedial exam
        exam_res = client.post("/api/remedial/exams", json={
            "title": "DBMS Remedial Quiz",
            "subject": "Database Management System",
            "durationMins": 30,
            "totalMarks": 20,
            "instructions": "For remedial students only",
            "questions": [{"questionText": "DBMS test Q", "options": ["A", "B", "C", "D"], "correctAnswer": "A"}]
        })
        self.assertEqual(exam_res.status_code, 200)

        # 2. Eligible student (< 40%) gets the exam (23CSE014 has 28% progress)
        eligible_res = client.get("/api/student/remedial-exams?student_identifier=23CSE014")
        self.assertEqual(eligible_res.status_code, 200)
        self.assertGreaterEqual(len(eligible_res.json()), 1)

        # 3. Ineligible student (>= 40%) gets EMPTY list (23CSE142 has 82% progress)
        ineligible_res = client.get("/api/student/remedial-exams?student_identifier=23CSE142")
        self.assertEqual(ineligible_res.status_code, 200)
        self.assertEqual(len(ineligible_res.json()), 0)

    def test_personal_details_management(self):
        import time
        ts = int(time.time() * 1000)
        ident = f"test.faculty.{ts}"
        email = f"test.faculty.{ts}@vignan.ac.in"

        # 1. Create a Faculty user with personal details
        create_res = client.post("/api/admin/create-user", json={
            "name": "Dr. Test Faculty",
            "role": "FACULTY",
            "identifier": ident,
            "email": email,
            "password": "Faculty@123",
            "contactNumber": "+91 9988776655",
            "department": "CSE",
            "classTeacherSection": "Section B"
        })
        self.assertEqual(create_res.status_code, 200)
        user = create_res.json()["user"]
        self.assertEqual(user["contactNumber"], "+91 9988776655")
        self.assertEqual(user["department"], "CSE")
        self.assertEqual(user["classTeacherSection"], "Section B")

        # 2. Update personal details via Admin endpoint
        user_id = user["id"]
        update_res = client.put(f"/api/admin/users/{user_id}", json={
            "name": "Dr. Updated Faculty",
            "contactNumber": "+91 9123456789",
            "department": "AI & DS",
            "classTeacherSection": "Section C"
        })
        self.assertEqual(update_res.status_code, 200)
        updated_user = update_res.json()["user"]
        self.assertEqual(updated_user["name"], "Dr. Updated Faculty")
        self.assertEqual(updated_user["contactNumber"], "+91 9123456789")
        self.assertEqual(updated_user["department"], "AI & DS")
        self.assertEqual(updated_user["classTeacherSection"], "Section C")

        # 3. Update section class teacher via profile endpoint
        prof_res = client.put(f"/api/user/profile?identifier={ident}", json={
            "classTeacherSection": "Section D"
        })
        self.assertEqual(prof_res.status_code, 200)
        self.assertEqual(prof_res.json()["user"]["classTeacherSection"], "Section D")

if __name__ == "__main__":
    unittest.main()

