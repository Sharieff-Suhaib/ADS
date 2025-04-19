#include <iostream>
#include <unordered_map>
#include <vector>
#include <string>
#include <limits>
#include <algorithm>

using namespace std;

const int INF = numeric_limits<int>::max();

struct Node {
    string id;
    string label;
};

struct Edge {
    string source;
    string target;
    int distance;
};

unordered_map<string, Node> nodes = {
    {"A", {"A", "Main Gate"}},
    {"B", {"B", "Main Gate Right Road"}},
    {"C", {"C", "Main Gate Left Road"}},
    {"D", {"D", "Anna Statue"}},
    {"E", {"E", "Anna Statue Right Road"}},
    {"F", {"F", "Anna Statue Left Road"}},
    {"G", {"G", "Red Building"}},
    {"H", {"H", "Red Building Right Road"}},
    {"I", {"I", "Red Building Left Road"}},
    {"J", {"J", "CEG Square"}},
    {"K", {"K", "Globe Statue"}},
    {"L", {"L", "RCC"}},
    {"M", {"M", "Library"}},
    {"N", {"N", "Vivek Audi"}},
    {"O", {"O", "Maths Dept"}},
    {"P", {"P", "Swimming Pool"}},
    {"Q", {"Q", "Hostel Road"}},
    {"R", {"R", "Science and Humanities"}},
    {"S", {"S", "CSE Dept"}},
    {"T", {"T", "IT Dept"}},
    {"U", {"U", "Knowledge Park"}},
    {"V", {"V", "ECE Dept"}},
    {"W", {"W", "NCC"}},
    {"X", {"X", "Manufacturing Dept"}},
    {"Y", {"Y", "Printing Dept"}},
    {"Z", {"Z", "Coffee Hut"}},
    {"AA", {"AA", "EEE Dept"}},
    {"AB", {"AB", "Civil Road"}},
    {"AC", {"AC", "Civil Dept"}},
    {"AD", {"AD", "Industrial Dept"}},
    {"AE", {"AE", "Mech Dept"}},
    {"AF", {"AF", "Mech Road"}},
    {"AG", {"AG", "Tag Audi"}},
    {"AH", {"AH", "Structural Eng Dept"}},
    {"AI", {"AI", "Transportation Eng/Soil Mechanics"}},
    {"AJ", {"AJ", "High Voltage Lab"}},
    {"AK", {"AK", "Ocean Management"}},
    {"AL", {"AL", "Mining Dept"}},
    {"AM", {"AM", "Power System Engineering"}}
};

vector<Edge> edges = {
    {"A", "C", 100}, {"A", "B", 130}, {"B", "J", 280}, {"C", "AD", 150},
    {"AD", "AB", 63}, {"AB", "AC", 80}, {"AB", "AJ", 56}, {"I", "AJ", 80},
    {"I", "G", 25}, {"G", "H", 25}, {"A", "D", 200}, {"D", "F", 20},
    {"F", "I", 70}, {"D", "E", 20}, {"E", "H", 70}, {"H", "J", 75},
    {"J", "K", 16}, {"K", "L", 88}, {"L", "M", 58}, {"K", "N", 80},
    {"N", "O", 110}, {"O", "P", 92}, {"P", "AA", 18}, {"AA", "AJ", 73},
    {"N", "Q", 83}, {"Q", "R", 110}, {"R", "S", 38}, {"S", "T", 50},
    {"T", "Y", 70}, {"T", "U", 30}, {"R", "V", 48}, {"V", "W", 43},
    {"W", "Z", 92}, {"Z", "Y", 18}, {"W", "X", 47}, {"P", "X", 40},
    {"AJ", "AI", 46}, {"AH", "AK", 150}, {"AI", "AH", 37}, {"AH", "AF", 70},
    {"AF", "AE", 54}, {"AF", "AG", 45}, {"AK", "AL", 82}, {"AL", "AM", 100},
    {"AM", "Z", 38}
};

void bellmanFord(const string& start, const string& end) {
    unordered_map<string, int> dist;
    unordered_map<string, string> prev;

    for (const auto& pair : nodes)
        dist[pair.first] = INF;

    dist[start] = 0;

    for (int i = 0; i < nodes.size() - 1; ++i) {
        for (const auto& edge : edges) {
            if (dist[edge.source] != INF && dist[edge.source] + edge.distance < dist[edge.target]) {
                dist[edge.target] = dist[edge.source] + edge.distance;
                prev[edge.target] = edge.source;
            }
        }
    }

    if (dist[end] == INF) {
        cout << "No path found between " << nodes[start].label << " and " << nodes[end].label << ".\n";
        return;
    }

    vector<string> path;
    for (string at = end; at != ""; at = prev[at])
        path.push_back(at);

    reverse(path.begin(), path.end());

    cout << "Shortest path from " << nodes[start].label << " to " << nodes[end].label << ":\n";
    for (const string& nodeId : path) {
        cout << nodes[nodeId].label;
        if (nodeId != end) cout << " -> ";
    }
    cout << "\nTotal distance: " << dist[end] << " meters\n";
}

void displayMenu() {
    cout << "\n--- Campus Navigation System ---\n";
    cout << "1. Show all nodes\n";
    cout << "2. Find shortest path\n";
    cout << "3. Exit\n";
    cout << "Choose an option: ";
}

void listNodes() {
    cout << "\nAvailable Nodes:\n";
    for (const auto& [id, node] : nodes) {
        cout << id << ": " << node.label << "\n";
    }
}

int main() {
    int choice;
    while (true) {
        displayMenu();
        cin >> choice;
        if (choice == 1) {
            listNodes();
        } else if (choice == 2) {
            string from, to;
            listNodes();
            cout << "Enter source node ID: ";
            cin >> from;
            cout << "Enter destination node ID: ";
            cin >> to;
            if (nodes.count(from) == 0 || nodes.count(to) == 0) {
                cout << "Invalid node IDs. Try again.\n";
                continue;
            }
            bellmanFord(from, to);
        } else if (choice == 3) {
            cout << "Exiting...\n";
            break;
        } else {
            cout << "Invalid choice.\n";
        }
    }
    return 0;
}
