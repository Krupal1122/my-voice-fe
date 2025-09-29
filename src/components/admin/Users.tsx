import { useEffect, useState } from "react";
import { db } from "../../auth/firebase";
import { collection, getDocs, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { RefreshCw, User as UserIcon, Trash2 } from "lucide-react";

interface User {
  id: string;
  uid: string;
  username?: string;
  email?: string;
  createdAt?: any;
}

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for Firebase data
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    console.log("Setting up Firebase Firestore listener...");
    
     const unsubscribe = onSnapshot(
       collection(db, "users"),
       (snapshot) => {
         console.log("Firebase data changed - Real-time sync activated!");
         console.log("Current users count:", snapshot.docs.length);
         
         // Check for all changes (add/modify/delete) - DETECT DELETIONS
         snapshot.docChanges().forEach((change) => {
           const userData = change.doc.data();
           if (change.type === "added") {
             console.log("User ADDED to Firebase:", change.doc.id, userData.username || userData.email);
             console.log("   → Will appear in Users.tsx automatically!");
           }
           if (change.type === "modified") {
             console.log("User MODIFIED in Firebase:", change.doc.id, userData.username || userData.email);
             console.log("   → Changes reflected in Users.tsx automatically!");
           }
           if (change.type === "removed") {
             console.log("User DELETED from Firebase (કોઈએ Firebase માંથી delete કર્યો):", change.doc.id);
             console.log("→ Will be REMOVED from Users.tsx automatically!");
             console.log("REAL-TIME SYNC: Firebase deletion → Users.tsx update");
             console.log("Users.tsx માંથી પણ automatically delete થઈ જશે!");
           }
         });
         
         const firebaseUsers: User[] = snapshot.docs.map((doc) => {
           const data = doc.data();
           console.log("Syncing user data:", { id: doc.id, username: data.username, email: data.email });
           
           return {
             id: doc.id,
             uid: data.uid || "N/A",
             username: data.username || "Unknown",
             email: data.email || "N/A",
             createdAt: data.createdAt,
           };
         });
         
         console.log("REAL-TIME SYNC complete - Updated users list:", firebaseUsers.length, "users");
         setUsers(firebaseUsers);
         setError(null);
         setLoading(false);
       },
      (err) => {
        console.error("Firebase error:", err);
        setError(`Firebase Error: ${err.message}`);
        setLoading(false);
      }
    );

    return () => {
      console.log("Cleaning up Firebase listener");
      unsubscribe();
    };
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const snapshot = await getDocs(collection(db, "users"));
      const firebaseUsers: User[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: data.uid || "N/A",
          username: data.username || "Unknown",
          email: data.email || "N/A",
          createdAt: data.createdAt,
        };
      });
      
      setUsers(firebaseUsers);
      console.log("Manual refresh completed:", firebaseUsers);
    } catch (err: any) {
      console.error("Refresh error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string, username: string) => {
    const confirmMessage = `DELETE USER CONFIRMATION\n\n` +
      `User: ${username}\n` +
      `ID: ${userId}\n\n` +
      `This will:\n` +
      `Remove user from Firebase database\n` +
      `Remove user from this Admin Panel\n` +
      `This action cannot be undone!\n\n` +
      `Are you sure you want to continue?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      console.log("Admin Panel: Starting user deletion...");
      console.log("   User ID:", userId);
      console.log("   Username:", username);
      console.log("   Deleting from Firebase Firestore database...");

      // DELETE FROM FIREBASE - આ line Firebase માંથી user ને delete કરે છે
      await deleteDoc(doc(db, "users", userId));

      console.log("SUCCESS: User deleted from Firebase Firestore!");
      console.log("Real-time listener will now update the Admin Panel automatically");
      console.log("CONFIRMED: Firebase માં user delete થઈ ગયો!");

      // Show success message
      alert(`User "${username}" deleted successfully!\n\n` +
        `Firebase Database: DELETED\n` +
        `Admin Panel: Will update automatically\n\n` +
        `Firebase માં user delete થઈ ગયો અને Admin Panel માંથી પણ automatically remove થઈ જશે!`);

    } catch (err: any) {
      console.error("FAILED to delete user:", err);
      console.error("   Error code:", err.code);
      console.error("   Error message:", err.message);

      alert(`Error deleting user "${username}":\n\n${err.message}\n\nPlease check Firebase security rules.`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-orange-500" />
             Users ({users.length})
          </h2>
          
        </div>
        
        <div className="flex gap-2">
          
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading Firebase data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-medium">Firebase Error:</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Firebase Users Table */}
      {!loading && !error && (
        <div className="mt-4">
          {users.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <UserIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Users Found in Firebase
              </h3>
              <p className="text-gray-600 mb-4">
                Firebase database is empty - no users have been stored yet
              </p>
              <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded">
                <p className="font-medium mb-1">To add users:</p>
                <p>Go to main website and sign up new users</p>
                <p>They will automatically appear here!</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 bg-white rounded-lg">
                <thead className="bg-orange-50">
                   <tr>
                     <th className="px-4 py-3 border text-left font-medium text-gray-700">Username</th>
                     <th className="px-4 py-3 border text-left font-medium text-gray-700">Email</th>
                     <th className="px-4 py-3 border text-left font-medium text-gray-700">Created At</th>
                     <th className="px-4 py-3 border text-left font-medium text-gray-700">Actions</th>
                   </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className={`hover:bg-orange-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-3 border font-medium text-gray-900">{user.username}</td>
                      <td className="px-4 py-3 border text-gray-700">{user.email}</td>
                       <td className="px-4 py-3 border text-sm text-gray-600">
                         {user.createdAt?.toDate
                           ? user.createdAt.toDate().toLocaleString()
                           : user.createdAt 
                           ? new Date(user.createdAt).toLocaleString()
                           : "N/A"}
                       </td>
                       <td className="px-4 py-3 border">
                         <button
                           onClick={() => deleteUser(user.id, user.username || 'Unknown')}
                           className="flex items-center gap-1 px-3 py-1  text-white rounded hover:bg-red-600 transition-colors text-sm"
                           title="Delete user from Firebase Database (Firebase માંથી delete કરશે)"
                         >
                           <Trash2 className="h-4 w-4 text-red-500" />
                           
                         </button>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
              
              
            </div>
          )}
        </div>
      )}
    </div>
  );
}