// lib/dummy-data.ts
export const dummyUserData = {
  id: 1,
  nama_lengkap: "John Doe",
  jenis_kelamin: "laki-laki",
  tgl_lahir: "2000-01-01",
  email: "john@example.com",
  no_handphone: "08123456789",
  foto_profile: "http://localhost:8000/storage/profile/foo.jpg",
  roles: ["user"],
};

// Data untuk testing berbagai role
export const dummyUsers = {
  user: {
    ...dummyUserData,
    roles: ["user"],
  },
  superadmin: {
    ...dummyUserData,
    id: 2,
    nama_lengkap: "Admin User",
    email: "admin@example.com",
    roles: ["superadmin"],
  },
  mitra: {
    ...dummyUserData,
    id: 3,
    nama_lengkap: "Mitra User",
    email: "mitra@example.com",
    roles: ["mitra"],
  },
  multiRole: {
    ...dummyUserData,
    id: 4,
    nama_lengkap: "Multi Role User",
    email: "multi@example.com",
    roles: ["user", "mitra"],
  },
};
