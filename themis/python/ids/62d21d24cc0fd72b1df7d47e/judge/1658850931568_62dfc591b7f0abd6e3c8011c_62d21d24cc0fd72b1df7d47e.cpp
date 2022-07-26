#include<bits/stdc++.h>
using namespace std;

string s, t, a;
int m, n, k;

bool check(int i) {
    for(int j = 0; j < n; j++) {
        if(s[i + j] != t[j]) return false;
    }
    return true;
}

int main() {
    getline(cin, s);
    getline(cin, t);
    getline(cin, a);
    m = s.length();
    n = t.length();
    k = a.length();
    for(int i = 0; i < m - n + 1; i++) {
        if(check(i)) {
            for(int j = 0; j < k; j++) {
                cout << a[j];
            }
            i = i + n - 1;
        } else {
            cout << s[i];
        }
    }
    for(int i = m - n + 1; i < m; i++) {
        cout << s[i];
    }
}