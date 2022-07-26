#include<bits/stdc++.h>
using namespace std;
#define int long long
#define fs first
#define sc second
#define pb push_back
#define mp make_pair
const int INF = 1e9 + 7, N = 1e5 + 7;

int calc(int x){
	return x * (x - 1) / 2;
}

signed main(){
	ios_base::sync_with_stdio(0);
	cin.tie(0);
	int n; cin >> n; vector<int> a(n + 1);
	for(int i = 1; i <= n; i++) cin >> a[i];
	
	vector<int> rem;
	for(int i = 1; i <= n; i++){
		rem.pb(a[i] % 200);
	}
	
	map<int, int> ma; set<int> se;
	for(int i = 0; i < rem.size(); i++){
		se.insert(rem[i]);
		ma[rem[i]]++;
	}
	vector<int> v;
	for(auto it = se.begin(); it != se.end(); it++){
		v.pb(*it);
	}	
	
	int res = 0;
	for(int i = 0; i < v.size(); i++){
		res += calc(ma[v[i]]);
	}
	
	cout << res << "\n";
		
	
	return 0;
}