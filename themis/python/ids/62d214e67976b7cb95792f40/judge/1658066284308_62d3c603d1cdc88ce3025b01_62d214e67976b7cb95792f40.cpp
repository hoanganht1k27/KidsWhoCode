#include<bits/stdc++.h>
using namespace std;

const int N = 1000004;

int n;
int a[N];
int k, x;

int main() {
    
    cin >> n >> k;
    for(int i = 1; i <= n; i++) {
        cin >> a[i];
    }
    for(int i = 1; i <= k - 1; i++) {
        cout << a[i] << " ";
    }
    for(int i = k + 1; i <= n; i++) {
        cout << a[i] << " ";
    }
}