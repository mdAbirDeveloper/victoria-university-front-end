import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StudentCards = ({ students }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {students.map((student) => {
        // ✅ Total attendance count (overall)
        const totalAttendance = student.present.reduce(
          (acc, rec) => {
            if (rec.isPresent) acc.Present += 1;
            else acc.Absent += 1;
            return acc;
          },
          { Present: 0, Absent: 0 }
        );

        // ✅ Subject-wise breakdown
        const subjectWise = {};
        student.present.forEach((rec) => {
          if (!subjectWise[rec.subject]) {
            subjectWise[rec.subject] = { Present: 0, Absent: 0 };
          }
          if (rec.isPresent) subjectWise[rec.subject].Present += 1;
          else subjectWise[rec.subject].Absent += 1;
        });

        const chartData = [
          { name: "Present", value: totalAttendance.Present },
          { name: "Absent", value: totalAttendance.Absent },
        ];

        const COLORS = ["#22c55e", "#ef4444"]; // green / red

        return (
          <div
            key={student._id}
            className="bg-gray-800 text-white rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col justify-between"
          >
            {/* Basic Info */}
            <div>
              <h2 className="text-2xl font-bold mb-2 text-yellow-300">
                {student.name}
              </h2>
              <p>
                <strong>Roll:</strong> {student.roll}
              </p>
              <p>
                <strong>Phone:</strong> {student.phone}
              </p>
              <p>
                <strong>Department:</strong> {student.department}
              </p>
              <p>
                <strong>Session:</strong> {student.session}
              </p>

              {/* Additional Info */}
              <p className="mt-2">
                <strong>Address:</strong> {student.address}
              </p>
              <p>
                <strong>Father:</strong> {student.fatherName} (
                {student.fatherPhone})
              </p>
              <p>
                <strong>Mother:</strong> {student.motherName} (
                {student.motherPhone})
              </p>
            </div>

            {/* Attendance Pie Chart */}
            <div className="mt-6">
              <h3 className="text-yellow-300 font-semibold mb-3 text-center">
                Overall Attendance
              </h3>
              {student.present.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={40}
                      paddingAngle={5}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                      }
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value}`, `${name}`]}
                      contentStyle={{
                        backgroundColor: "#FFFF",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="mt-4 text-yellow-200 text-center">
                  No attendance records
                </p>
              )}
            </div>

            {/* ✅ Subject-wise Details */}
            <div className="mt-6 border-t border-gray-600 pt-4">
              <h4 className="text-yellow-300 font-semibold mb-2">
                Subject-wise Attendance:
              </h4>
              <ul className="space-y-1">
                {Object.entries(subjectWise).map(([subject, data]) => (
                  <li
                    key={subject}
                    className="flex justify-between text-sm bg-gray-700 px-3 py-2 rounded-lg"
                  >
                    <span className="font-medium">{subject}</span>
                    <span>
                      ✅ {data.Present} | ❌ {data.Absent}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentCards;
